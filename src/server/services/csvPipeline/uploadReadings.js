/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express = require('express');
const { CSVPipelineError } = require('./CustomErrors');
const success = require('./success');
const loadCsvInput = require('../pipeline-in-progress/loadCsvInput');
const Meter = require('../../models/Meter');

/**
 * Middleware that uploads readings via the pipeline. This should be the final stage of the CSV Pipeline.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {string} filepath Path to readings csv file
 * @param conn 
 * @returns 
 */
async function uploadReadings(req, res, filepath, conn) {
	const { createMeter, duplications, headerRow,
		meterName, mode, timeSort, update } = req.body; // extract query parameters
	const hasHeaderRow = (headerRow === 'true');
	const readingRepetition = parseInt(duplications, 10);
	let meter = await Meter.getByName(meterName, conn)
		.catch(async err => {
			// Meter#getByNames throws an error when no meter is found. We need the catch clause to account for this error.
			if (createMeter !== 'true') {
				// If createMeter is not set to true, we do not know what to do with the readings so we error out.
				throw new CSVPipelineError(
					`User Error: Meter with name '${meterName}' not found. createMeter needs to be set true in order to automatically create meter.`,
					err.message
				);
			} else {
				// If createMeter is true, we will create the meter for the user.
				// The meter type cannot be null. We use MAMAC as a default.
				const tempMeter = new Meter(undefined, meterName, undefined, false, false, Meter.type.MAMAC, undefined, undefined, meterName);
				await tempMeter.insert(conn);
				return await Meter.getByName(tempMeter.name, conn); // Get meter from DB after insert because some defaults are set within the DB.
			}
		});

	// Handle other parameter defaults
	// TODO length should be renamed lengthGap
	let { cumulative, cumulativeReset, cumulativeResetStart, cumulativeResetEnd, lengthVariation, length } = req.body;
	let areReadingsCumulative;
	let doReadingsReset;
	let readingGap = length;
	let readingLengthVariation = lengthVariation;
	// We know from the validation stage of the pipeline that the 'cumulative' and 'cumulativeReset' fields
	// will have one of the follow values undefined, 'true', or 'false'. If undefined, this means that 
	// the uploader wants the pipeline to use the database's (i.e. the meter's) default value.
	// TODO: We made the assumption that in the DB, the cumulative and cumulativeReset columns is either true or false.
	// On further inspection, these values can be null. At the moment, we are not sure what this means for the pipeline.
	// As a quick fix, we will assume that null, means false.
	if (cumulative === undefined) {
		if (meter.cumulative === null) {
			areReadingsCumulative = false;
		} else {
			areReadingsCumulative = meter.cumulative;
		}
	} else {
		areReadingsCumulative = (cumulative === 'true');
	}

	if (cumulativeReset === undefined) {
		if (meter.cumulativeReset === null) {
			doReadingsReset = false;
		} else {
			doReadingsReset = meter.cumulativeReset;
		}
	} else {
		doReadingsReset = (cumulativeReset === 'true');
	}

	// For cumulative reset times the validation step sets to undefined if not provided so do similar to ones above
	// but just pass if value was defined.
	if (cumulativeResetStart === undefined) {
		if (meter.cumulativeResetStart === null) {
			// This probably should not happen with a new DB but keep just in case.
			cumulativeResetStart = '0:00:00';
		} else {
			cumulativeResetStart = meter.cumulativeResetStart;
		}
	}
	if (cumulativeResetEnd === undefined) {
		if (meter.cumulativeResetEnd === null) {
			// This probably should not happen with a new DB but keep just in case.
			cumulativeResetEnd = '23:59:59.999999';
		} else {
			cumulativeResetEnd = meter.cumulativeResetEnd;
		}
	}

	// Similar for time variation in gap and length between readings
	
		if (length === undefined) {
			if (meter.reading_gap === null) {
				// This probably should not happen with a new DB but keep just in case.
				// No variation allowed.
				readingGap = 0;
			} else {
				readingGap = meter.reading_gap;
			}
		} else {
			// Convert string that is a real number to a value.
			// Note the variable changes from string to real number.
			readingGap = parseFloat(readingGap);
		}

	if (readingLengthVariation === undefined) {
		if (meter.reading_variation === null) {
			// This probably should not happen with a new DB but keep just in case.
			// No variation allowed.
			readingLengthVariation = 0;
		} else {
			readingLengthVariation = meter.reading_variation;
		}
	} else {
		// Convert string that is a real number to a value.
		// Note the variable changes from string to real number.
		readingLengthVariation = parseFloat(readingLengthVariation);
	}

	const mapRowToModel = row => { return row; }; // STUB function to satisfy the parameter of loadCsvInput.
	await loadCsvInput(
		filepath,
		meter.id,
		mapRowToModel,
		false,
		areReadingsCumulative,
		doReadingsReset,
		cumulativeResetStart,
		cumulativeResetEnd,
		readingGap,
		readingLengthVariation,
		readingRepetition,
		timeSort,
		hasHeaderRow,
		undefined,
		conn
	); // load csv data
	// TODO: If unsuccessful upload then an error will be thrown. We need to catch this error.
	//fs.unlink(filepath).catch(err => log.error(`Failed to remove the file ${filepath}.`, err));
	success(req, res, 'It looks like success.'); // TODO: We need a try catch for all these awaits.
	return;
}

module.exports = uploadReadings;