import React from 'react'
import {ItemTypes} from './Constants'
import {DragSource} from 'react-dnd'
import {ListGroupItem} from 'react-bootstrap'

var patientSource = {
  beginDrag: function (props) {
    return {
      name: props.name,
      id: props.id,
      patient: props.patient,
      removeFromList: props.removeFromList
    }
  },

  endDrag: function (props, monitor) {
    var item = monitor.getItem()
    var dropResult = monitor.getDropResult()
  }

}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

var Patient = React.createClass({

  getDefaultProps: function () {
    return {
      name: 'John Doe'
    }
  },
  render: function () {
    var connectDragSource = this.props.connectDragSource
    var isDragging = this.props.isDragging
    var name = this.props.name
    var id = this.props.id
    var patient = this.props.patient
    var removeFromList = this.props.removeFromList

    return connectDragSource(
      <div>
        {this.props.name}
      </div>
		)
  }
})

export default DragSource(ItemTypes.PATIENT, patientSource, collect)(Patient)
