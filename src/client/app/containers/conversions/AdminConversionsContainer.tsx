/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import * as _ from 'lodash';
import { Conversion, ConversionBidirectional } from '../../types/items';
import AdminConversionsComponents from '../../components/conversions/AdminConversionsComponents';
import HeaderContainer from '../HeaderContainer';
import FooterContainer from '../FooterContainer';


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
	}

    state: AdminConversionsContainerState = {
        conversions: [],
		history: []
    }

	// private editConversion(source_id: number, newBidirectional: ConversionBidirectional, newSlope: number, newIntercept: number, newNote: string) {
	// 	const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
	// 	const targetConversion = newConversions.find(conversion => conversion.source_id === source_id);
	// 	if (targetConversion !== undefined) {
	// 		targetConversion.bidirectional = newBidirectional;
	// 		targetConversion.slope = newSlope;
	// 		targetConversion.intercept = newIntercept;
	// 		targetConversion.note = newNote;
	// 		this.setState(prevState => ({
	// 			conversions: newConversions,
	// 			history: [...prevState.history, newConversions]
	// 		}));
	// 	}
	// }

	private editBidirectional(source_id: number, newBidirectional: ConversionBidirectional) {
		const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
		const targetConversion = newConversions.find(conversion => conversion.source_id === source_id);
		if (targetConversion !== undefined) {
			targetConversion.bidirectional = newBidirectional;
			this.setState(prevState => ({
				conversions: newConversions,
				history: [...prevState.history, newConversions]
			}));
		}
	}

	private editSlope(source_id: number, newSlope: number) {
		const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
		const targetConversion = newConversions.find(conversion => conversion.source_id === source_id);
		if (targetConversion !== undefined) {
			targetConversion.slope = newSlope;
			this.setState(prevState => ({
				conversions: newConversions,
				history: [...prevState.history, newConversions]
			}));
		}
	}

	private editIntercept(source_id: number, newIntercept: number) {
		const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
		const targetConversion = newConversions.find(conversion => conversion.source_id === source_id);
		if (targetConversion !== undefined) {
			targetConversion.intercept = newIntercept;
			this.setState(prevState => ({
				conversions: newConversions,
				history: [...prevState.history, newConversions]
			}));
		}
	}

	private editNote(source_id: number, newNote: string) {
		const newConversions = _.cloneDeep<Conversion[]>(this.state.conversions);
		const targetConversion = newConversions.find(conversion => conversion.source_id === source_id);
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
		// 	await conversionsApi.editConversions(this.state.conversions);
		// 	showSuccessNotification(translate('users.successfully.edit.users')); // I have no clue what this does or how to make it th econversions form
		// 	this.setState(currentState => ({
		// 		history: [_.cloneDeep<Conversion[]>(currentState.conversions)]
		// 	}));
		// } catch (error) {
		// 	showErrorNotification(translate('users.failed.to.edit.users'));  // I have no clue what this does or how to make it th econversions form
		// }
	}

	private async deleteConversion(source_id: number, destination_id: number) {
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
					// editConversion = {this.editConversion}
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