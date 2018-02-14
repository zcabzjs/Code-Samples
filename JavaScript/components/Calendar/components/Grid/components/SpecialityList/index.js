import React from 'react'
import {ListGroupItem, ListGroup} from 'react-bootstrap'

import {style} from 'glamor'

var SpecialtyList = React.createClass({
  getDefaultProps: function () {
    return {
      patients: [],
      hasFinishedLoading: false
    }
  },

  addAndRemovePatient: function (patient, index, meeting, specialty, year, month, day) { // Removes patient, and adds it to the main patient list again.
    this.props.addPatient(patient)
		// ADD PUT REQUEST HERE
    this.props.removeFromGrid(index, meeting, specialty, year, month, day)
  },

  render: function () {
    if(!this.props.hasFinishedLoading){
      return (
        <div>
          <h3>{this.props.specialty}</h3>
          <ListGroup fill>
            <ListGroupItem className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> </ListGroupItem>
          </ListGroup>

        </div>
      )
    }
    else{
      if (this.props.patients.length === 0 || this.props.patients == undefined) {
      return (
        <div>
          <h3>{this.props.specialty}</h3>
          <ListGroup fill>
            <ListGroupItem> None </ListGroupItem>
          </ListGroup>

        </div>
      )
    }   else      {
      var patientlisting = this.props.patients.map((patient, i) => {
        return (
          <div>
            <ListGroupItem>
              <div id={i}>{patient['firstNames'] + ' ' + patient['lastNames']}</div>
              <button className={'btn btn-danger btn-xs ' + styles.btn_delete_patient} onClick={() => this.addAndRemovePatient(patient, i, this.props.meeting, this.props.specialty, this.props.year, this.props.month, this.props.day)}> <i className='fa fa-trash-o' aria-hidden='true' /> </button>
            </ListGroupItem>

          </div>
        )
      })
      return (
        <div>
          <h3>{this.props.specialty}</h3>
          <ListGroup fill>
            {patientlisting}
          </ListGroup>

        </div>
      )
    }
    }
    
  }
})

const styles = {
  btn_delete_patient: style({
    position: 'absolute',
    right: '6px',
    width: '22px',
    top: '6px',
    borderRadius: '3px'
  })
}

export default SpecialtyList
