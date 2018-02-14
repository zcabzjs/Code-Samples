import React from 'react'
import {ItemTypes} from './../../../PatientList/components/Patient/Constants'
import {DropTarget} from 'react-dnd'
import {Modal, Button, ListGroup} from 'react-bootstrap'
import PatientList from './../../../PatientList'
import SpecialtyList from './components/SpecialityList'

import {css, style} from 'glamor'

var gridTarget = {
  drop: function (props, monitor, component) {
    var item = monitor.getItem()
	  // item = Patient
	  	console.log(item)
    var index = item.id
    if (component.props.dayEvent.meeting.length !== 0) {
      item.removeFromList(index)
      component.setState({
        meetingChoiceModalIsOpen: true,
        currentPatient: item.patient
      })
    }
		// Only remove if theres a meeting that day
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

var Grid = React.createClass({
  getInitialState: function () {
    return {
      specialtyModalIsOpen: false,    // false
      choiceModalIsOpen: false,
      meetingChoiceModalIsOpen: false,
      currentMeeting: null,
      currentPatient: null,
      day: this.props.day,
      month: this.props.month,
      year: this.props.year,
      interestedMeeting: null,
      getPatients: false
    }
  },

  addPatientsToGrid: function (patient, meeting, specialty, year, month, day) {
    this.props.addPatients(patient, meeting, specialty, year, month, day)
    this.setState({
      currentPatient: null,
      choiceModalIsOpen: false
    })
  },

  meetingToggleModal: function () {
    this.setState({
      meetingChoiceModalIsOpen: !this.state.meetingChoiceModalIsOpen
    })
    this.props.addPatient(this.state.currentPatient)
  },

  choiceToggleModal: function () {
    this.setState({
      choiceModalIsOpen: !this.state.choiceModalIsOpen
    })
    this.props.addPatient(this.state.currentPatient)
  },

  toggleModal: function () {
    this.setState({
      specialtyModalIsOpen: !this.state.specialtyModalIsOpen,
      interestedMeeting: null
    })
  },

  toggleModal2: function (meeting, year, month, day) {
		// POST IS DONE HERE, MIGHT NEED MORETHAN ONE PARAMETER
    this.props.getPatients(meeting, year, month, day)
    this.setState({
      specialtyModalIsOpen: true,
      interestedMeeting: meeting
    })

		/* if(this.state.getPatients){
			this.setState({
				specialtyModalIsOpen: true,
				interestedMeeting: meeting
			});
		}
		else{
			var url = "WHATEVER";
			var that = this;
			axios.get(url).then(function(response){
				var patients = response.data;
				//PARSE patients based on specialities
				that.props.getPatients(whatever...)

				that.setState({
					specialtyModalIsOpen: true,
					interestedMeeting: meeting,
					getPatients: true
				});
			})
		} */
  },

  fromMeetingToSpecialty: function (meeting) {
    this.setState({
      currentMeeting: meeting,
      meetingChoiceModalIsOpen: false,
      choiceModalIsOpen: true
    })
  },

  renderGrid: function () {
		// map through specialty
    var currentPatient = this.state.currentPatient
    var dayEvent = this.props.dayEvent
    var that = this
// here
    var specialtyListing = function (specialities, interestedMeeting, meetingTitle, removeFromGrid, addPatient, year2, month2, day2) {
      var list = specialities.map((specialty, i) =>
        <SpecialtyList patients={specialty['patients']} hasFinishedLoading={that.props.hasFinishedLoading} meeting={interestedMeeting} specialty={specialty['name']} removeFromGrid={removeFromGrid} addPatient={addPatient} year={year2} month={month2} day={day2} />
			)
      return list
    }
// here
    var specialtyButtonList = function (addPatientsToGrid, currentPatient, currentMeeting, year, month, day) {
      var list
      if (currentMeeting != null && currentMeeting != undefined) {
        list = currentMeeting['specialities'].map((specialty, i) =>
          <Button bsClass={styles.btn_marg + ' btn btn-primary'} bsStyle='primary' onClick={() => addPatientsToGrid(currentPatient, currentMeeting, specialty['name'], year, month, day)}>{specialty['name']}</Button>
				)
      }
      return list
    }

    var fromMeetingToSpecialtyButtons = this.props.dayEvent.meeting.map(function (meet) {
      return (
        <Button bsClass={styles.btn_marg + ' btn btn-primary'} bsStyle='primary' onClick={() => that.fromMeetingToSpecialty(meet)}>{meet['title']}</Button>
      )
    })

    var modalMeeting = this.props.dayEvent.meeting.map((meet, i) => {
      var my_className
      switch (meet['meeting_id']) {
        case 20:
          my_className = styles.btn_meeting1
          break
        case 21:
          my_className = styles.btn_meeting2
          break
        default:
          my_className = styles.btn_meeting3
      }

      return (
        <div>
          <div className={styles.btn_container}>
            <button className={my_className} onClick={() => this.toggleModal2(meet, this.state.year, this.state.month, this.state.day)}>{meet['title'].length < 10 ? meet['title'] : meet['title'].substring(0, 10) + '...'}</button>
          </div>
          <Modal
            show={this.state.specialtyModalIsOpen && this.state.interestedMeeting === meet}
            onHide={this.toggleModal}
            container={this}
            aria-labelledby='contained-modal-title'
					>
            <Modal.Header closeButton>
              <Modal.Title id='contained-modal-title'>
							Patients Assignment
						</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>Meeting starting time: {meet['starting_time'].replace(/(.*)\D\d+/, '$1')}</p>
                <p>Meeting ending time: {meet['ending_time'].replace(/(.*)\D\d+/, '$1')}</p>
              </div>
              <div>
                {specialtyListing(meet['specialities'], this.state.interestedMeeting, meet['title'], this.props.removeFromGrid, this.props.addPatient, this.props.year, this.props.month, this.props.day)}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className={styles.btn_marg} onClick={this.toggleModal}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      )
    })

    return (
      <div className={styles.cell_container}>
        <div className='text-right'>{this.props.children}</div>
        <div>
          {modalMeeting}
        </div>
        <Modal
          show={this.state.meetingChoiceModalIsOpen}
          onHide={this.meetingToggleModal}
          container={this}
          aria-labelledby='contained-modal-title'
				    >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title'>
								Choose Meeting
							</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {fromMeetingToSpecialtyButtons}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.meetingToggleModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.choiceModalIsOpen}
          onHide={this.choiceToggleModal}
          container={this}
          aria-labelledby='contained-modal-title'
					    >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title'>
									Choose Speciality
								</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {specialtyButtonList(this.addPatientsToGrid, currentPatient, this.state.currentMeeting, this.props.year, this.props.month, this.props.day)}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.choiceToggleModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  },

  render: function () {
    var name = this.props.name
    var age = this.props.age
    var connectDropTarget = this.props.connectDropTarget
    var isOver = this.props.isOver
    return connectDropTarget(
      <div className={styles.cell}>
        {this.renderGrid()}
      </div>
      	)
  }
})

const styles = {
  cell: css({
    backgroundColor: '#f5f5f5',
	    height: '100%',
	    width: '100%'
  }),
  peach_panel: css({
    borderRadius: '3px',
    '& .panel_heading': css({
      backgroundColor: 'rgb(32, 45, 56)',
    		color: 'white'
    })
  }),
  btn_marg: style({
    marginLeft: '5px',
    marginRight: '5px'
  }),
  btn_delete_patient: style({
    position: 'absolute',
    right: '6px',
    width: '22px',
    top: '6px',
    borderRadius: '3px'
  }),
  btn_meeting1: style({
    maxWidth: '100%',
    padding: '5px',
    margin: '5px',
    border: 'none',
	    borderRadius: '0px',
	    backgroundColor: '#EAFAE4',
	    color: 'black',
    borderBottom: 'solid 3px #9DEF80'
  }),
  btn_meeting2: style({
    maxWidth: '100%',
    padding: '5px',
    margin: '5px',
    border: 'none',
	    borderRadius: '0px',
	    backgroundColor: '#FBEDDE',
	    color: 'black',
    borderBottom: 'solid 3px #F5B15A'
  }),
  btn_meeting3: style({
    maxWidth: '100%',
    padding: '5px',
    margin: '5px',
    border: 'none',
	    borderRadius: '0px',
	    backgroundColor: '#E0EFFC',
	    color: 'black',
    borderBottom: 'solid 3px #61BCF8'
  }),
  cell_container: style({
    padding: '5px',
    maxWidth: '100%',
    maxHeight: '100%'
  }),
  btn_container: style({
    position: 'relative'
  })
}

export default DropTarget(ItemTypes.PATIENT, gridTarget, collect)(Grid)
