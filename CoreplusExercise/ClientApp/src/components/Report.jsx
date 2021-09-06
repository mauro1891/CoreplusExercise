import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

export class Report extends Component {
    constructor(props) {
        super(props);

        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeDD = this.onChangeDD.bind(this);

        this.state = {
            appointments: [],
            appointmentDetails: [],
            practitioners: [],
            practitionerSummary: [],
            startDate: '',
            endDate: '',
            loadingPractitioners: true,
            loadingPracSummary: true,
            loadingAppointment: true,
            loadingAppoDetails: true,
            failed: false,
            error: '',
            selectedOptions: [],
            rowIsActivePS: '',
            rowIsActiveA: ''
        }
    }

    componentDidMount() {
        this.populatePractitionersList();
    }

    populatePractitionersList() {
        axios.get("api/ReportSummary/GetPractitioners").then(result => {
            const response = result.data;
            const options = [];
            for (var i in result.data) {
                options.push({
                    "label": result.data[i].name,
                    "value": result.data[i].id
                });
            }
            this.setState({ appointments: response, loadingPractitioners: false, failed: false, error: "", practitioners: options });
        }).catch(error => {
            this.setState({ appointments: [], loadingPractitioners: false, failed: true, error: "Practitioner List could not be loaded" });
        });
    }
    populatePracSummaryData() {
        const PractitionersId = [];
        for (var i in this.state.selectedOptions) {
            if (this.state.selectedOptions[i].value !== '*')
                PractitionersId.push(this.state.selectedOptions[i].value)
        }
        axios.get("api/ReportSummary/GetPractitionersSummary", {
            params: { practitionerIds: PractitionersId, startDate: this.state.startDate, endDate: this.state.endDate },
            paramsSerializer: params => {
                return qs.stringify(params)
            }
        }).then(result => {
            const response = result.data;
            this.setState({ practitionerSummary: response, loadingPracSummary: false, failed: false, error: "", loadingAppointment: true, loadingAppoDetails: true });
        }).catch(error => {
            this.setState({ practitionerSummary: [], loadingPracSummary: false, failed: true, error: "Practitioner Summary could not be loaded", loadingAppointment: true, loadingAppoDetails: true });
        });
    }
    populateAppointmentsData(id, date) {
        axios.get("api/ReportSummary/GetAppointmentByPractitionerIdAndDate", {
            params: { practitionerId: id, Date: date },
            paramsSerializer: params => {
                return qs.stringify(params)
            }
        }).then(result => {
            const response = result.data;
            this.setState({ appointments: response, loadingAppointment: false, failed: false, error: "", loadingAppoDetails: true });
        }).catch(error => {
            this.setState({ appointments: [], loadingAppointment: false, failed: true, error: "Appointments could not be loaded", loadingAppoDetails: true });
        });
    }
    populateAppoDetailsData(response) {
        this.setState({ appointmentDetails: response, loadingAppoDetails: false, failed: false, error: "" });
    }

    onSubmit(e) {
        e.preventDefault();
        this.populatePracSummaryData()
    }
    onChangeStartDate(e) {
        this.setState({
            startDate: e.target.value
        });
    }
    onChangeEndDate(e) {
        this.setState({
            endDate: e.target.value
        });
    }

    onPractitionerSummaryClick = (e) => {
        this.populateAppointmentsData(e.practitionerId, e.monthDate.slice(0, 10));
        this.setState({
            rowIsActivePS: e.id,
        });
    }
    onAppointmentClick = (e) => {
        this.populateAppoDetailsData(e);
        this.setState({
            rowIsActiveA: e.id,
        });
    }
    getDropdownButtonLabel({ placeholderButtonLabel, value }) {
        if (value && value.some((o) => o.value === "*")) {
            return `${placeholderButtonLabel}: All`;
        } else {
            return `${placeholderButtonLabel}: ${value.length} selected`;
        }
    }
    onChangeDD(value, event) {
        if (event.action === "select-option" && event.option.value === "*") {
            this.setState({ selectedOptions: [{ label: "All", value: "*" }, ...this.state.practitioners] });
        } else if (
            event.action === "deselect-option" &&
            event.option.value === "*"
        ) {
            this.setState({ selectedOptions: [] });
        } else if (event.action === "deselect-option") {
            this.setState({ selectedOptions: value.filter((o) => o.value !== "*") });
        } else if (value.length === this.state.practitioners.length - 1) {
            this.setState({ selectedOptions: this.state.practitioners });
        } else {
            this.setState({ selectedOptions: value });
        }
    }
    renderPractitioners(practitioners) {
        return (
            <>
                <form onSubmit={this.onSubmit}>
                    <div className="row align-items-end m-2">
                        <div className="col col-md-3 col-sm-3 col-xs-12">
                            <label>Practitioner:  </label>
                            <ReactMultiSelectCheckboxes
                                options={[{ label: "All", value: "*" }, ...practitioners]}
                                placeholderButtonLabel="Practitioners"
                                getDropdownButtonLabel={this.getDropdownButtonLabel}
                                value={this.state.selectedOptions}
                                onChange={this.onChangeDD}
                                isSearchable={false}
                                hideSearch={true}
                                required
                            />
                        </div>
                        <div className="col col-md-3 col-sm-3 col-xs-12">
                            <label>Start Date:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={this.state.startDate}
                                onChange={this.onChangeStartDate}
                                required
                            />
                        </div>
                        <div className="col col-md-3 col-sm-3 col-xs-12">
                            <label>End Date:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={this.state.endDate}
                                onChange={this.onChangeEndDate}
                                required
                            />
                        </div>
                        <div className="col col-md-3 col-sm-3 col-xs-12">
                            <input type="submit" value="Search" className="btn btn-primary" />
                        </div>
                    </div>
                </form>
            </>
        );
    }
    renderPractitionerSummaryTable(practitionersSummary) {
        return (
            <>
                <div className="card">
                    <h5 className="card-header">
                        Practitioner Summary
                    </h5>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Month Year</th>
                                <th>Practitioner</th>
                                <th>Cost</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                practitionersSummary.map(practitionerSummary => (
                                    <tr key={practitionerSummary.id} data-item={practitionerSummary.id} onClick={() => this.onPractitionerSummaryClick(practitionerSummary)}
                                        className={`tr ${this.state.rowIsActivePS === practitionerSummary.id ? 'active' : ''}`} >
                                        <td>{practitionerSummary.monthYear}</td>
                                        <td>{practitionerSummary.name}</td>
                                        <td>{new Intl.NumberFormat("en-AU", {
                                            style: "currency",
                                            currency: "AUD",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(practitionerSummary.cost)}</td>
                                        <td>{new Intl.NumberFormat("en-AU", {
                                            style: "currency",
                                            currency: "AUD",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(practitionerSummary.revenue)}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </>
        );
    }

    renderAllAppointmentsTable(appointments) {
        return (
            <>
                <div className="card sticky-top">
                    <h5 className="card-header">
                        Appointment Summary
                    </h5>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Cost</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                appointments.map(appointment => (
                                    <tr key={appointment.id} data-item={appointment.id} onClick={() => this.onAppointmentClick(appointment)}
                                        className={`tr ${this.state.rowIsActiveA === appointment.id ? 'active' : ''}`} >
                                        <td>{appointment.date.slice(0, 10)}</td>
                                        <td>{new Intl.NumberFormat("en-AU", {
                                            style: "currency",
                                            currency: "AUD",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(appointment.cost)}</td>
                                        <td>{new Intl.NumberFormat("en-AU", {
                                            style: "currency",
                                            currency: "AUD",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(appointment.revenue)}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </>
        );
    }

    renderAppoDetailsTable(appointment) {
        return (
            <>
                <div className="card sticky-top">
                    <h5 className="card-header">
                        Appointment Details
                    </h5>
                    <div className="card-body">
                        <h6 className="card-title">Client Name</h6>
                        <p className="card-text">{appointment.client_Name}</p>
                        <h6 className="card-title">Appointment Type</h6>
                        <p className="card-text">{appointment.appointment_Type}</p>
                        <h6 className="card-title">Appointment Date</h6>
                        <p className="card-text">{appointment.date.slice(0, 10)}</p>
                        <h6 className="card-title">Duration</h6>
                        <p className="card-text">{appointment.duration}</p>
                        <h6 className="card-title">Cost</h6>
                        <p className="card-text">{new Intl.NumberFormat("en-AU", {
                            style: "currency",
                            currency: "AUD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(appointment.cost)}</p>
                        <h6 className="card-title">Revenue</h6>
                        <p className="card-text">{new Intl.NumberFormat("en-AU", {
                            style: "currency",
                            currency: "AUD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(appointment.revenue)}</p>
                    </div>
                </div>
            </>
        );
    }

    render() {

        let practitioners = this.state.loadingPractitioners ? (
            <p>
                <em>loading Practitioners Summary.</em>
            </p>
        ) : (this.state.failed ? (
            <div className="text-danger">
                <em>{this.state.error}</em>
            </div>
        ) : (
            this.renderPractitioners(this.state.practitioners))
        )

        let practiSummary = this.state.loadingPracSummary ? (
            <p>
            </p>
        ) : (this.state.practitionerSummary.length === 0 ? (
            <div className="text-info">
                <em>Record not found.</em>
            </div>
        ) : (this.state.failed ? (
            <div className="text-danger">
                <em>{this.state.error}</em>
            </div>
        ) : (
            this.renderPractitionerSummaryTable(this.state.practitionerSummary))
        ))

        let appointments = this.state.loadingAppointment && !this.state.practitionerSummary.length === 0 ? (
            <p>
                <em>Please select a Practitioner to see the Appointments.</em>
            </p>
        ) : (this.state.loadingAppointment ? (
            <div>
            </div>
        ) : (this.state.failed ? (
            <div className="text-danger">
                <em>{this.state.error}</em>
            </div>
        ) : (
            this.renderAllAppointmentsTable(this.state.appointments))
        ))

        let appoDetails = this.state.loadingAppoDetails && !this.state.loadingAppointment ? (
            <p>
                <em>Please select an Appointment for more details.</em>
            </p>
        ) : (this.state.loadingAppoDetails ? (
            <div>
            </div>
        ) : (this.state.failed ? (
            <div className="text-danger">
                <em>{this.state.error}</em>
            </div>
        ) : (
            this.renderAppoDetailsTable(this.state.appointmentDetails))
        ))

        return (
            <React.Fragment>
                <h1>Coreplus Financial Report</h1>
                <p>Please select the parametres to generate the financial report.</p>
                {practitioners}
                <div className="row  mt-4">
                    <div className="col col-md-5 col-sm-12 col-xs-12">
                        {practiSummary}
                    </div>
                    <div className="col col-md-4 col-sm-12 col-xs-12">
                        {appointments}
                    </div>
                    <div className="col col-md-3 col-sm-12 col-xs-12">
                        {appoDetails}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}