import React from 'react';
import { connect } from 'react-redux';
import {
    deleteClient,
    updateClient,
    addNewActivityToClient,
    createNewBill,
} from '../actions';

import { formatTime } from '../helpers/helpers';

import FlatButton from 'material-ui/FlatButton';
import ActivityChip from './ActivityChip';
import ContentAdd from 'material-ui/svg-icons/content/add';

import EditableText from './EditableText';
import BackTo from './BackTo';
import BillCard from './BillCard';
import DeleteClientButton from './DeleteClientButton';

const mapStateToProps = (state) => ({
    clients: state.data.clients,
    activities: state.data.activities,
    currency: state.options.currency,
    billTextTemplate: state.options.billTextTemplate,
});

const mapDispatchToProps = (dispatch) => ({
    deleteClient: (client, deleteActivities) => dispatch(deleteClient(client, deleteActivities)),
    updateClient: (props) => dispatch(updateClient(props)),
    addNewActivityToClient: (clientId) => dispatch(addNewActivityToClient(clientId)),
    createNewBill: (client, billTextTemplate, currency) => dispatch(createNewBill(client, billTextTemplate, currency)), 
});


const SingleClient = ({
            history,
            clients,
            currency,
            deleteClient,
            updateClient,
            addNewActivityToClient,
            createNewBill,
            billTextTemplate,
            match,
        }) => {
        const clientId = Number(match.params.clientId);
        const client = clients
            .filter((client) => client.id === clientId)
            .reduce((acc, i) => i, null)
            ;

        if (!client) {
            return (
                <div>
                    <BackTo history={history} />
                    <div>{`ERROR: no client with id ${clientId}`}</div>
                </div>
            );
        }

        return (
            <div className="mainWrapper">
                <BackTo 
                    history={history}
                    title={`Client id:${client.id}`}
                />
                <h1 className="clientTitleBar titleBar">
                    <EditableText
                        className="clientName row"
                        editable={false}
                        text={client.name}
                        handleChange={(text) => updateClient({
                            id: client.id,
                            name: text
                        })}
                    />
                    <DeleteClientButton
                        history={history}
                        deleteClient={deleteClient}
                        client={client}
                        redirectToHome={true}
                    />
                </h1>
                <div className="hourlyRateWrapper row">
                    <span className="hourlyRateLabel">{`Default hourly rate: ${currency}`} </span>
                    <EditableText
                        className="hourlyRate"
                        editable={false}
                        text={client.defaultHourlyRate}
                        handleChange={(defaultHourlyRate) => updateClient({
                            id: client.id,
                            defaultHourlyRate: Number(defaultHourlyRate)
                        })}
                    />
                </div>
                <h2 className="sectionSubtitle">Billing data</h2>
                <div className="row">
                    <span className="label">{'Address: '} </span>
                    <EditableText
                        className="address"
                        editable={false}
                        text={client.billingInfo.address}
                        handleChange={(address) => updateClient({
                            id: client.id,
                            billignInfo: Object.assign(client.billingInfo, { address })
                        })}
                    />
                </div>
                <div className="row">
                    <span className="label">{'Phone: '} </span>
                    <EditableText
                        className="phone"
                        editable={false}
                        text={client.billingInfo.phone}
                        handleChange={(phone) => updateClient({
                            id: client.id,
                            billignInfo: Object.assign(client.billingInfo, { phone })
                        })}
                    />
                </div>
                <div className="row">
                    <span className="label">{'Email: '} </span>
                    <EditableText
                        className="email"
                        editable={false}
                        text={client.billingInfo.email}
                        handleChange={(email) => updateClient({
                            id: client.id,
                            billignInfo: Object.assign(client.billingInfo, { email })
                        })}
                    />
                </div>
                <div className="row">
                    <span className="label">{'VAT number: '} </span>
                    <EditableText
                        className="vatNumber"
                        editable={false}
                        text={client.billingInfo.vatNumber}
                        handleChange={(vatNumber) => updateClient({
                            id: client.id,
                            billignInfo: Object.assign(client.billingInfo, { vatNumber })
                        })}
                    />
                </div>

                <h2 className="sectionSubtitle">Time overview</h2>
                <div className="totalTimeWrapper row">
                    <span className="totalTimeLabel">{'Total time: (h:mm:ss)'} </span>
                    <span className="totalTime">{formatTime(client.totalTime)}</span>
                </div>
                <div className="totalCostWrapper row">
                    <span className="totalCostLabel">{`Total cost: ${currency}`} </span>
                    <span className="totalCost">{Math.round(client.totalCost)}</span>
                </div>
                <div className="totalTimeToBillWrapper row">
                    <span className="totalTimeToBillLabel">{'Total time to bill (h:mm:ss): '} </span>
                    <span className="totalTimeToBill">{formatTime(client.totalTimeToBill)}</span>
                </div>
                <div className="totalCostToBillWrapper row">
                    <span className="totalCostToBillLabel">{`Total cost to bill: ${currency}`} </span>
                    <span className="totalCostToBill">{Math.round(client.totalCostToBill)}</span>
                </div>

                <h2 className="sectionSubtitle">Projects
                <FlatButton
                        icon={<ContentAdd />}
                        onClick={() => {
                            addNewActivityToClient(client.id);
                        }}
                    />
                </h2>
                <div className="chipWrapper">
                    {client.activities.map((activity) => <ActivityChip
                        key={activity.id}
                        activity={activity}
                    />)}
                </div>

                <h2 className="sectionSubtitle">Invoices
                <FlatButton
                        icon={<ContentAdd />}
                        onClick={() => createNewBill(client, billTextTemplate, currency)}
                    />
                </h2>
                <div className="invoicesWrapper cardsWrapper row">
                    {client.bills.map((bill) => <BillCard
                        key={bill.id}
                        bill={bill}
                    />)}
                </div>
            </div>
        )
    }

export default connect(mapStateToProps, mapDispatchToProps)(SingleClient);