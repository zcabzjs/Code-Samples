import React from 'react'
import Patient from './components/Patient'
import {style} from 'glamor'
import {Modal, Button, Panel, ListGroup, ListGroupItem, Col} from 'react-bootstrap'

var PatientList = React.createClass({
  getInitialState: function () {
    return {
      patients: this.props.patients,
      deleteModalIsOpen: false,
      currentIndex: null
    }
  },

  getDefaultProps: function () {
    return {
      hasFinishedLoading: false
    }
  },


  toggleModal: function (index) {
    this.setState({
      deleteModalIsOpen: !this.state.deleteModalIsOpen,
      currentIndex: index
    })
  },

  deleteFromModal: function (index, patient) {
    this.props.removeFromList(index)
		// PUT REQUEST HERE status = -1
		/* var url = "http://peachteam35.uksouth.cloudapp.azure.com:8080/api/referrals/" + patient["referral_id"];
    	var that = this;
    	axios.put(url,
    		{ "status" = -1 }
    	).then(function(response){
      		console.log(response);
    	}) */
    this.setState({
      deleteModalIsOpen: !this.state.deleteModalIsOpen,
      currentIndex: null
    })
  },

  render: function () {
    var patientlisting = this.state.patients.map((patient, i) => {
      var name = patient['firstNames'] + ' ' + patient['lastNames']
      return (
        <div>
          <ListGroupItem bsClass={styles.listHover + ' list-group-item'}>
            <div>
              <Patient patient={patient} name={name} id={i} removeFromList={this.props.removeFromList} />
              <button className={styles.btn_marg} className={'btn btn-danger btn-xs ' + styles.btn_delete_patient} onClick={() => { this.toggleModal(i) }}> <i className='fa fa-trash-o' aria-hidden='true' /> </button>
            </div>
          </ListGroupItem>
        </div>
      )
    })
    if(!this.props.hasFinishedLoading){
      return (
        <div>
          <Panel className={styles.peach_panel+" text-center"} collapsible defaultExpanded header='Patient list'>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <br />
          </Panel>
        </div>
      )
    }
    else{
      if (this.state.patients.length === 0) {
      return (
        <div>
          <Panel className={styles.peach_panel} collapsible defaultExpanded header='Patient list'>
            No patients to assign.
            <br />
          </Panel>

          <Modal
            show={this.state.deleteModalIsOpen}
            onHide={this.toggleModal}
            container={this}
            aria-labelledby='contained-modal-title'
            >
            <Modal.Header closeButton>
              <Modal.Title id='contained-modal-title'>
                Are you sure you want to delete the patient from the patient list?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Button bsClass={styles.btn_marg + ' btn btn-primary'} onClick={() => this.toggleModal()}>No</Button>
              <Button bsClass={styles.btn_marg + ' btn btn-danger'} onClick={() => this.deleteFromModal(this.state.currentIndex)}>Yes</Button>
            </Modal.Body>
          </Modal>

        </div>
      )
    }   else {
      return (
        <div>

          <Panel className={styles.peach_panel} collapsible defaultExpanded header='Patient list'>
            Drag a patient and drop it to the calendar.
            <br />
            <ListGroup fill>
              {patientlisting}
            </ListGroup>
          </Panel>

          <Modal
            show={this.state.deleteModalIsOpen}
            onHide={this.toggleModal}
            container={this}
            aria-labelledby='contained-modal-title'
            >
            <Modal.Header closeButton>
              <Modal.Title id='contained-modal-title'>
                Are you sure you want to delete the patient from the patient list?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Button className={styles.btn_marg} bsStyle='danger' onClick={() => this.deleteFromModal(this.state.currentIndex, this.state.patients[this.state.currentIndex])}>Yes</Button>
              <Button className={styles.btn_marg} bsStyle='primary' onClick={() => this.toggleModal()}>No</Button>
            </Modal.Body>
          </Modal>
        </div>
      )
    }
    }
    
  }
})

const styles = {
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
  listHover: style({
    ':hover': {
      backgroundColor: 'rgba(0,0,0,0.1)'
    }
  })
}

export default PatientList
