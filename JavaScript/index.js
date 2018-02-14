import React, { Component } from 'react'
import PatientList from './components/PatientList'
import Grid from './components/Calendar/components/Grid'
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'
import Calendar from './components/Calendar'
import {connect} from 'react-redux'
import {Col} from 'react-bootstrap'
import axios from 'axios'

// To replace with api call

var Scheduler = React.createClass({
  getInitialState: function () {
    return {
      patients: [],
      hasFinishedLoading: false
    }
  },

  componentWillMount: function () {
    var that = this
    var url = 'http://peachteam35.uksouth.cloudapp.azure.com:8080/api/referrals/waiting'
    const openEHRSessionId = this.props.openEHRSessionId
    const config = {
      headers: {
        Authorization: 'Basic dWNscGVhY2hfYzRoOlFXeFBwYnl3',
        'EHr-Session-disabled': openEHRSessionId
      }
    }
    var patients = this.state.patients
    var ehrIDArray = [];
    var referralIDArray = [];
    var referredByIDArray = [];
    var promises = [];

    axios.get(url).then(function (response) {
      var ehrDetails = response.data
      ehrDetails.forEach(function(ehrdetail){
        ehrIDArray.push(ehrdetail['ehrID']);
        referralIDArray.push(ehrdetail['referral_id']);
        referredByIDArray.push(ehrdetail['referred_by_id']);
        var ehrURL = 'https://ehrscape.code4health.org/rest/v1/demographics/ehr/' + ehrdetail['ehrID'] + '/party'
        promises.push(axios.get(ehrURL, config))
      });

      axios.all(promises).then(function(results){
        var index = 0;
        results.forEach(function(response){
          var patient = response.data.party;
          patient['referral_id'] = referralIDArray[index]
          patient['ehrID'] = ehrIDArray[index]
          patient['referred_by_id'] = referredByIDArray[index]
          patients.push(patient)
          index++
          console.log("Pushed patient", patient)
        })
        that.setState({
          patients: patients,
          hasFinishedLoading: true
        })
      })
      /*for (var i = 0; i < ehrDetails.length; i++) {
        var ehrID = ehrDetails[i]['ehrID']
        var referralID = ehrDetails[i]['referral_id']
        var referredByID = ehrDetails[i]['referred_by_id']
        var ehrURL = 'https://ehrscape.code4health.org/rest/v1/demographics/ehr/' + ehrID + '/party'
        axios.get(ehrURL, config).then(function (response) {
          var patient = response.data.party
          patient['referral_id'] = referralID
          patient['ehrID'] = ehrID
          patient['referred_by_id'] = referredByID
          patients.push(patient)
          console.log(patient)
          console.log('ehrID')
          console.log(ehrID)
          console.log(patients)
          that.setState({
            patients: patients
          })
        }).catch(function (error) {
          console.log(error)
        })
      }*/
    }).catch(function (error) {
      console.log(error)
    })
  },

  removeFromList: function (index) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    var array = this.state.patients
    var patient = array[index]
    const putURL = 'http://peachteam35.uksouth.cloudapp.azure.com:8080/api/referrals/'
    axios.put(putURL + patient['referral_id'], {
      'Referral': {
        'status': -1
      }
    }, config)
    array.splice(index, 1)
    this.setState({
      patients: array
    })
  },

  addPatient: function (patient) {
    // PUT POST REQUEST HERE status = 0
    this.state.patients.push(patient)
    this.setState({
      patients: this.state.patients
    })
  },

  render: function () {
    return (
      <div className='App'>
        <Col xs={12} sm={10} md={3} smOffset={1} mdOffset={0}>
          <PatientList hasFinishedLoading={this.state.hasFinishedLoading} patients={this.state.patients} name='List of Patients' removeFromList={this.removeFromList} />
        </Col>
        <Col xs={12} sm={10} md={9} smOffset={1} mdOffset={0}>
          <Calendar openEHRSessionId={this.props.openEHRSessionId} addPatient={this.addPatient} />
        </Col>
      </div>
    )
  }
})

const mapStateToProps = (state) => ({openEHRSessionId: state.data.user.openEHRSessionId})

export default connect(mapStateToProps)(DragDropContext(HTML5Backend)(Scheduler))
