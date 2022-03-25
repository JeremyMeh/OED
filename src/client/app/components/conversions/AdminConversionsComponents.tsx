/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
import * as React from 'react';
import { Conversion, ConversionBidirectional } from '../../types/items';
import { Button, Input, Table } from 'reactstrap';
import TooltipHelpContainerAlternative from '../../containers/TooltipHelpContainerAlternative';
import TooltipMarkerComponent from '../TooltipMarkerComponent';
import { FormattedMessage } from 'react-intl';
import UnsavedWarningContainer from '../../containers/UnsavedWarningContainer';
import { updateUnsavedChanges, removeUnsavedChanges } from '../../actions/unsavedWarning';
import store from '../../index'

interface AdminConversionsComponentProps {
    conversions: Conversion[];
	deleteConversion: (source_id: number, destination_id: number) => Promise<void>;
	edited: boolean;
	editConversion: (source_id: number, newBidirectional: ConversionBidirectional, newSlope: number, newIntercept: number, newNote: string) => void;
    editBidirectional: (source_id: number, destinationId: number, newBidirectional: ConversionBidirectional) => void;
    editSlope: (source_id: number, destinationId: number, newSlope: number) => void;
    editIntercept: (source_id: number, destinationId: number, newIntercept: number) => void;
    editNote: (source_id: number, destinationId: number, newNote: string) => void;
	submitConversionEdits: () => Promise<void>;

    // sourceId:string, destinationId: string, bidirectional:ConversionBidirectional, slope:number, intercept:number, note:string
}

//source_id, dest_id, bidirection, slope, intercept, note

function AdminConversionsComponents(props: AdminConversionsComponentProps) {
    

    const removeUnsavedChangesFunction = (callback: () => void) => {
		// This function is called to reset all the inputs to the initial state
		// Do not need to do anything since unsaved changes will be removed after leaving this page
		callback();
	}

    const submitUnsavedChangesFunction = (successCallback: () => void, failureCallback: () => void) => {
		// This function is called to submit the unsaved changes
		props.submitConversionEdits().then(successCallback, failureCallback);
	}


    const addUnsavedChanges = () => {
		// Notify that there are unsaved changes
		store.dispatch(updateUnsavedChanges(removeUnsavedChangesFunction, submitUnsavedChangesFunction));
	}

    const clearUnsavedChanges = () => {
		// Notify that there are no unsaved changes
		store.dispatch(removeUnsavedChanges());
	}


    
    const titleStyle: React.CSSProperties = {
        textAlign: 'center'
    };

    const tableStyle: React.CSSProperties = {
        marginLeft: '10%',
        marginRight: '10%'
    };

    // const buttonsStyle: React.CSSProperties = {
    //     display: 'flex',
    //     justifyContent: 'space-between'
    // }

    const tooltipStyle = {
        display: 'inline-block',
        fontSize: '50%'
    };

    return (
        <div>
            <UnsavedWarningContainer />
            <TooltipHelpContainerAlternative page='users' />
            <div className='container-fluid'>
                <h2 style={titleStyle}>
                    <FormattedMessage id='Conversions'/>
                    <div style={tooltipStyle}>
                        <TooltipMarkerComponent page='users' helpTextId='help.admin.conversions' />
                    </div>
                </h2>
                <div style={tableStyle}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th> <FormattedMessage id='source id'/> </th>
                                <th> <FormattedMessage id='destination id'/> </th>
                                <th> <FormattedMessage id='bidirectional'/> </th>
                                <th> <FormattedMessage id='slope'/> </th>
                                <th> <FormattedMessage id='intercept'/> </th>
                                <th> <FormattedMessage id='note'/> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.conversions.map(conversion => (
                                <tr key={conversion.sourceId}>
                                    <td>{conversion.sourceId}</td>
                                    <td>{conversion.destinationId}</td>
                                    <td>
                                        <Input
                                            type='select'
                                            value={conversion.bidirectional}
                                            onChange={({ target }) => {
                                                props.editBidirectional(conversion.sourceId, conversion.destinationId, target.value as ConversionBidirectional);
                                                addUnsavedChanges();
                                            }}
                                        >
                                            {Object.entries(ConversionBidirectional).map(([bidirectional, val]) => (
                                                <option value={val} key={bidirectional}> {bidirectional} </option>
                                            ))}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input
                                            type='number'
                                            value={conversion.slope}
                                            onChange={({ target }) => {
                                                props.editSlope(conversion.sourceId, conversion.destinationId, +target.value as number);
                                                addUnsavedChanges();
                                            }}
                                        >
                                        </Input>
                                    </td>
                                    <td>
                                        <Input
                                            type='number'
                                            value={conversion.intercept}
                                            onChange={({ target }) => {
                                                props.editIntercept(conversion.sourceId, conversion.destinationId, +target.value as number);
                                                addUnsavedChanges();
                                            }}
                                        >
                                        </Input>
                                    </td>
                                    <td>
                                        <Input
                                            type='text'
                                            value={conversion.note}
                                            onChange={({ target }) => {
                                                props.editNote(conversion.sourceId, conversion.destinationId, target.value as string);
                                                addUnsavedChanges();
                                            }}
                                        >
                                        </Input>
                                    </td>
                                    <td>
                                        <Button color='success' disabled={!props.edited} onClick={() => { 
                                            props.submitConversionEdits(
                                                // conversion.sourceId.toString(),
                                                // conversion.destinationId.toString(),
                                                // conversion.bidirectional,
                                                // conversion.slope,
                                                // conversion.intercept,
                                                // conversion.note
                                                ); clearUnsavedChanges(); }}>
                                            <FormattedMessage id='update.component'/>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button color='danger' onClick={() => { props.deleteConversion(conversion.sourceId, conversion.destinationId); }}>
                                            <FormattedMessage id='delete.component'/>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* <div style={buttonsStyle}>
                        <CreateUserLinkButtonComponent /> // we need to make our own one of these
                        <Button
							color='success'
							disabled={!props.edited}
							onClick={() => {
								props.submitConversionEdits();
								clearUnsavedChanges();
							}}
						>
							<FormattedMessage id='save.role.changes'/>
						</Button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default AdminConversionsComponents;