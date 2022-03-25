/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import * as _ from 'lodash';
import { Conversion, ConversionBidirectional } from '../../types/items';
import AdminConversionsComponents from '../../components/conversions/AdminConversionsComponents';
import HeaderContainer from '../HeaderContainer';
import FooterContainer from '../FooterContainer';
// import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import { conversionsApi } from '../../utils/api';
// import translate from '../../utils/translate';


interface AdminConversionsDisplayContainerProps {
	fetchConversions: () => Conversion[];
}

interface AdminConversionsContainerState {
	conversions: Conversion[],
	history: Conversion[][]
}

export default class AdminConversionsContainer extends React.Component<AdminConversionsDisplayContainerProps, AdminConversionsContainerState> {
	constructor(props: AdminConversionsDisplayContainerProps) {
		super(props);
		this.editConversion = this.editConversion.bind(this)
		this.editBidirectional = this.editBidirectional.bind(this)
		this.editSlope = this.editSlope.bind(this)
		this.editIntercept = this.editIntercept.bind(this)
		this.editNote = this.editNote.bind(this)

	}

    state: AdminConversionsContainerState = {
        conversions: [],
		history: []
    }

	async componentDidMount() {
		const conversions = await this.fetchConversions();
		this.setState({ conversions, history: [_.cloneDeep<Conversion[]>(conversions)] });
	}

	private async fetchConversions() {
		return await conversionsApi.getAll();
	}

	private editConversion(sourceId: number, newBidirectional: ConversionBidirectional, newSlope: number, newIntercept: number, newNote: string) {
		const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
		const targetConversion = newConversions.find(conversion => conversion.sourceId === sourceId);
		if (targetConversion !== undefined) {
			targetConversion.bidirectional = newBidirectional;
			targetConversion.slope = newSlope;
			targetConversion.intercept = newIntercept;
			targetConversion.note = newNote;
			this.setState(prevState => ({
				conversions: newConversions,
				history: [...prevState.history, newConversions]
			}));
		}
	}

	private editBidirectional(sourceId: number, destinationId: number, newBidirectional: ConversionBidirectional) {
		const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
		const targetConversion = newConversions.find(conversion => (conversion.sourceId === sourceId && conversion.destinationId === destinationId));
		if (targetConversion !== undefined) {
			targetConversion.bidirectional = newBidirectional;
			this.setState(prevState => ({
				conversions: newConversions,
				history: [...prevState.history, newConversions]
			}));
		}
	}

	private editSlope(sourceId: number, destinationId: number, newSlope: number) {
		const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
		const targetConversion = newConversions.find(conversion => (conversion.sourceId === sourceId && conversion.destinationId === destinationId));
		if (targetConversion !== undefined) {
			targetConversion.slope = newSlope;
			this.setState(prevState => ({
				conversions: newConversions,
				history: [...prevState.history, newConversions]
			}));
		}
	}

	private editIntercept(sourceId: number, destinationId: number, newIntercept: number) {
		const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
		const targetConversion = newConversions.find(conversion => (conversion.sourceId === sourceId && conversion.destinationId === destinationId));
		if (targetConversion !== undefined) {
			targetConversion.intercept = newIntercept;
			this.setState(prevState => ({
				conversions: newConversions,
				history: [...prevState.history, newConversions]
			}));
		}
	}

	private editNote(sourceId: number, destinationId: number, newNote: string) {
		const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
		const targetConversion = newConversions.find(conversion => (conversion.sourceId === sourceId && conversion.destinationId === destinationId));
		if (targetConversion !== undefined) {
			targetConversion.note = newNote;
			this.setState(prevState => ({
				conversions: newConversions,
				history: [...prevState.history, newConversions]
			}));
		}
	}

	private async submitConversionEdits() {
		// try {
		// 	await conversionsApi.editConversion(sourceId, destinationId, bidirectional, slope, intercept, note);
		// 	showSuccessNotification(translate('conversions.successfully.edit.conversions')); // I have no clue what this does or how to make it th econversions form
		// 	this.setState(currentState => ({
		// 		history: [_.cloneDeep<Conversion[]>(currentState.conversions)]
		// 	}));
		// } catch (error) {
		// 	showErrorNotification(translate('conversions.failed.to.edit.conversions'));  // I have no clue what this does or how to make it th econversions form
		// }
	}

	private async deleteConversion(sourceId: number, destinationId: number) {
		// try {
		// 	await usersApi.deleteUser(email);
		// 	const users = await this.fetchUsers();
		// 	this.setState({ users });
		// 	showSuccessNotification(translate('users.successfully.delete.user'));
		// } catch (error) {
		// 	showErrorNotification(translate('users.failed.to.delete.user'));
		// }
	}

	public render() {
		return (
			<div>
				<HeaderContainer />
				<AdminConversionsComponents
					conversions = {this.state.conversions}
					deleteConversion = {this.deleteConversion}
					edited = {!_.isEqual(this.state.conversions, this.state.history[0])}
					editConversion = {this.editConversion}
					editBidirectional = {this.editBidirectional}
					editSlope = {this.editSlope}
					editIntercept = {this.editIntercept}
					editNote = {this.editNote}
					submitConversionEdits = {this.submitConversionEdits}
				/>
				<FooterContainer />
			</div>
		)
	}
}