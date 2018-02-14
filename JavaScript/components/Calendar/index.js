import React from 'react'
import Grid from './components/Grid'
import axios from 'axios'
import isEqual from 'lodash.isequal'
const _ = require('underscore')
import {css} from 'glamor'

const base_url = 'http://peachteam35.uksouth.cloudapp.azure.com:8080/api/scheduler/'

let Calendar = React.createClass({
  calc: function (year, month) {
    if (this.state.selectedElement) {
      if (this.state.selectedMonth != month || this.state.selectedYear != year) {
        this.state.selectedElement.classList.remove('r-selected')
      } else {
        this.state.selectedElement.classList.add('r-selected')
      }
    }
    return {
      firstOfMonth: new Date(year, month, 1),
      daysInMonth: new Date(year, month + 1, 0).getDate()
    }
  },
  componentWillMount: function () {
    this.setState(this.calc.call(null, this.state.year, this.state.month))
    let events = this.state.events
    let meetings
    let month2 = this.state.month === 12 ? 1 : this.state.month + 1
    let urlmonth = month2 > 9 ? month2 : '0' + month2
    let urlyear = this.state.year
    let url = base_url + urlmonth + '/' + urlyear
    let compareMeetings = function (meeting1, meeting2) {
      return (meeting1['meeting_occurence_id'] === meeting2['meeting_occurence_id'] && meeting1['meeting_id'] === meeting2['meeting_id'] && meeting1['occurence_date'] === meeting2['occurence_date'] && meeting1['title'] === meeting2['title'] && meeting1['starting_time'] === meeting2['starting_time'] && meeting1['ending_time'] === meeting2['ending_time'] && meeting1['created_at'] === meeting2['created_at'])
    }
    let that = this
    axios.get(url).then(function (response) {
      meetings = response.data
      for (let i = 0; i < meetings.length; i++) {
        let found = 0
        let d = new Date(meetings[i]['occurence_date'])
        if (events.length === 0) {
          let newEventTest = {
            date: d,
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate(),
            meeting: []
          }
          newEventTest.meeting.push(meetings[i])
          events.push(newEventTest)
        } else {
          for (let j = 0; j < events.length; j++) {
            if (d.getFullYear() === events[j].year && d.getMonth() === events[j].month && d.getDate() === events[j].day) {
              found = 1
              let alreadyExists = false
              for (let k = 0; k < events[j].meeting.length; k++) {
                if (compareMeetings(meetings[i], events[j].meeting[k])) {
                  alreadyExists = true
                }
              }
              if (!alreadyExists) {
                events[j].meeting.push(meetings[i])
              }
            }
          }
          if (found === 0) {
            let newEventTest = {
              date: d,
              year: d.getFullYear(),
              month: d.getMonth(),
              day: d.getDate(),
              meeting: []
            }
            newEventTest.meeting.push(meetings[i])
            events.push(newEventTest)
          }
          found = 0
        }
      }
      that.setState({
        events: events
      })
    }).catch(function (error) {
      console.log(error)
    })
  },
  componentDidMount: function () {

  },
  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.onSelect && prevState.selectedDt != this.state.selectedDt) {
      this.props.onSelect.call(this.getDOMNode(), this.state)
    }
  },
  getInitialState: function () {
    let date = new Date()
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      selectedYear: date.getFullYear(),
      selectedMonth: date.getMonth(),
      selectedDate: date.getDate(),
      selectedDt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      startDay: 1,
      weekNumbers: false,
      minDate: this.props.minDate ? this.props.minDate : null,
      disablePast: this.props.disablePast ? this.props.disablePast : false,
      dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      monthNamesFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstOfMonth: null,
      daysInMonth: null,
      hasFinishedLoading: false,
      events: []
    }
  },
  getPrev: function () {
    let state = {}
    if (this.state.month > 0) {
      state.month = this.state.month - 1
      state.year = this.state.year
    } else {
      state.month = 11
      state.year = this.state.year - 1
    }
    let meetings
    let month2 = state.month === 12 ? 1 : state.month + 1
    let urlmonth = month2 > 9 ? month2 : '0' + month2
    let urlyear = state.year
    let url = base_url + urlmonth + '/' + urlyear
    let that = this
    let events = this.state.events
    let compareMeetings = function (meeting1, meeting2) {
      return (meeting1['meeting_occurence_id'] === meeting2['meeting_occurence_id'] && meeting1['meeting_id'] === meeting2['meeting_id'] && meeting1['occurence_date'] === meeting2['occurence_date'] && meeting1['title'] === meeting2['title'] && meeting1['starting_time'] === meeting2['starting_time'] && meeting1['ending_time'] === meeting2['ending_time'] && meeting1['created_at'] === meeting2['created_at'])
    }
    axios.get(url).then(function (response) {
      meetings = response.data
      for (let i = 0; i < meetings.length; i++) {
        let found = 0
        let d = new Date(meetings[i]['occurence_date'])
        if (events.length === 0) {
          let newEventTest = {
            date: d,
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate(),
            meeting: []
          }
          newEventTest.meeting.push(meetings[i])
          events.push(newEventTest)
        } else {
          for (let j = 0; j < events.length; j++) {
            if (d.getFullYear() === events[j].year && d.getMonth() === events[j].month && d.getDate() === events[j].day) {
              found = 1
              let alreadyExists = false
              for (let k = 0; k < events[j].meeting.length; k++) {
                if (compareMeetings(meetings[i], events[j].meeting[k])) {
                  alreadyExists = true
                }
              }
              if (!alreadyExists) {
                events[j].meeting.push(meetings[i])
              }
            }
          }
          if (found === 0) {
            let newEventTest = {
              date: d,
              year: d.getFullYear(),
              month: d.getMonth(),
              day: d.getDate(),
              meeting: []
            }
            newEventTest.meeting.push(meetings[i])
            events.push(newEventTest)
          }
          found = 0
        }
      }
      that.setState({
        events: events
      })
    }).catch(function (error) {
      console.log(error)
    })
    Object.assign(state, this.calc.call(null, state.year, state.month))
    this.setState(state)
  },
  getNext: function () {
    let state = {}
    if (this.state.month < 11) {
      state.month = this.state.month + 1
      state.year = this.state.year
    } else {
      state.month = 0
      state.year = this.state.year + 1
    }
    let meetings
    let month2 = state.month === 12 ? 1 : state.month + 1
    let urlmonth = month2 > 9 ? month2 : '0' + month2
    let urlyear = state.year
    let url = base_url + urlmonth + '/' + urlyear
    let that = this
    let events = this.state.events
    let compareMeetings = function (meeting1, meeting2) {
      return (meeting1['meeting_occurence_id'] === meeting2['meeting_occurence_id'] && meeting1['meeting_id'] === meeting2['meeting_id'] && meeting1['occurence_date'] === meeting2['occurence_date'] && meeting1['title'] === meeting2['title'] && meeting1['starting_time'] === meeting2['starting_time'] && meeting1['ending_time'] === meeting2['ending_time'] && meeting1['created_at'] === meeting2['created_at'])
    }
    axios.get(url).then(function (response) {
      meetings = response.data
      for (let i = 0; i < meetings.length; i++) {
        let found = 0
        let d = new Date(meetings[i]['occurence_date'])
        if (events.length === 0) {
          let newEventTest = {
            date: d,
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate(),
            meeting: []
          }
          newEventTest.meeting.push(meetings[i])
          events.push(newEventTest)
        } else {
          for (let j = 0; j < events.length; j++) {
            if (d.getFullYear() === events[j].year && d.getMonth() === events[j].month && d.getDate() === events[j].day) {
              found = 1
              let alreadyExists = false
              for (let k = 0; k < events[j].meeting.length; k++) {
                if (compareMeetings(meetings[i], events[j].meeting[k])) {
                  alreadyExists = true
                }
              }
              if (!alreadyExists) {
                events[j].meeting.push(meetings[i])
              }
            }
          }
          if (found === 0) {
            let newEventTest = {
              date: d,
              year: d.getFullYear(),
              month: d.getMonth(),
              day: d.getDate(),
              meeting: []
            }
            newEventTest.meeting.push(meetings[i])
            events.push(newEventTest)
          }
          found = 0
        }
      }
      that.setState({
        events: events
      })
    }).catch(function (error) {
      console.log(error)
    })
    Object.assign(state, this.calc.call(null, state.year, state.month))
    this.setState(state)
  },

  selectDate: function (year, month, date, element) {
    if (this.state.selectedElement) {
      this.state.selectedElement.classList.remove('r-selected')
    }
    element.target.classList.add('r-selected')
    this.setState({
      selectedYear: year,
      selectedMonth: month,
      selectedDate: date,
      selectedDt: new Date(year, month, date),
      selectedElement: element.target
    })
  },

  getPatients: function (meeting, year, month, day) {
    this.setState({
      hasFinishedLoading: false
    })
    let that = this
    const openEHRSessionId = this.props.openEHRSessionId
    const url = 'http://peachteam35.uksouth.cloudapp.azure.com:8080/api/patient_assignments/meeting_occurence/' + meeting['meeting_occurence_id']
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const configEHR = {
      headers: {
        Authorization: 'Basic dWNscGVhY2hfYzRoOlFXeFBwYnl3',
        'EHr-Session-disabled': openEHRSessionId,
        'Content-Type': 'application/json'
      }
    }
    axios.get(url, config).then(function (response) {
      let meetings = response.data
      let ehrIDArray = [];
      let referralIDArray = [];
      let patientAssignmentIDArray = [];
      let specialityIDArray = [];
      let promises = [];
      meetings.forEach(function(meeting){
        ehrIDArray.push(meeting['ehrID']);
        patientAssignmentIDArray.push(meeting['patient_assigment_id']);
        referralIDArray.push(meeting['referral_id']);
        specialityIDArray.push(meeting['speciality_id']);
        let ehrID = meeting['ehrID']
        let ehrURL = 'https://ehrscape.code4health.org/rest/v1/demographics/ehr/' + ehrID + '/party'
        promises.push(axios.get(ehrURL, configEHR))
      })
      let events = that.state.events;
      axios.all(promises).then(function(results){
        let index = 0;
        results.forEach(function(response){
          let patient = response.data.party;
          patient['patient_assignment_id'] = patientAssignmentIDArray[index]
          patient['ehrID'] = ehrIDArray[index]
          patient['referral_id'] = referralIDArray[index]
          patient['speciality_id'] = specialityIDArray[index]
          console.log("KNOWN", patient)
          index++
          for (let l = 0; l < events.length; l++) {
            for (let j = 0; j < events[l].meeting.length; j++) {
              if (_.isEqual(meeting, events[l].meeting[j])) {
                for (let k = 0; k < events[l].meeting[j]['specialities'].length; k++) {
                  if (events[l].meeting[j]['specialities'][k]['speciality_id'] == patient['speciality_id']) {
                    if (events[l].meeting[j].specialities[k].hasOwnProperty('patients')) {
                          let alreadyExists = false
                          let similarIndex = null
                          for (let m = 0; m < events[l].meeting[j]['specialities'][k]['patients'].length; m++) {
                              if (events[l].meeting[j]['specialities'][k]['patients'][m]['firstNames'] == patient['firstNames'] && events[l].meeting[j]['specialities'][k]['patients'][m]['lastNames'] == patient['lastNames'] && events[l].meeting[j]['specialities'][k]['patients'][m]['gender'] == patient['gender'] && events[l].meeting[j]['specialities'][k]['patients'][m]['dateOfBirth'] == patient['dateOfBirth']) {
                                similarIndex = m
                                if (events[l].meeting[j]['specialities'][k]['patients'][m]['patient_assignment_id'] == patient['patient_assignment_id']) {
                                      alreadyExists = true
                                }
                              }
                            }
                          if (!alreadyExists && similarIndex != null) {
                                events[l].meeting[j]['specialities'][k]['patients'].splice(similarIndex, 1)
                                events[l].meeting[j]['specialities'][k]['patients'].push(patient)
                              }
                            else if(!alreadyExists && similarIndex == null){
                              events[l].meeting[j]['specialities'][k]['patients'].push(patient)
                            }

                        } else {
                          events[l].meeting[j]['specialities'][k]['patients'] = []
                          events[l].meeting[j]['specialities'][k]['patients'].push(patient)
                        }
                  }
                }
              }
            }
          }
        })
        that.setState({
          events: events,
          hasFinishedLoading: true
        })
      })
      /*for (let i = 0; i < meetings.length; i++) {

        let ehrID = meetings[i]['ehrID']
        let ehrURL = 'https://ehrscape.code4health.org/rest/v1/demographics/ehr/' + ehrID + '/party'
        let specialityID = meetings[i]['speciality_id']
        let patient_assignment_id = meetings[i]['patient_assigment_id']
        let referral_id = meetings[i]['referral_id']
        axios.get(ehrURL, configEHR).then(function (res) {
          let events = that.state.events
          let patient = res.data.party
          patient['patient_assignment_id'] = patient_assignment_id
          patient['ehrID'] = ehrID
          patient['referral_id'] = referral_id
          for (let l = 0; l < events.length; l++) {
            for (let j = 0; j < events[l].meeting.length; j++) {
              if (_.isEqual(meeting, events[l].meeting[j])) {
                for (let k = 0; k < events[l].meeting[j]['specialities'].length; k++) {
                  if (events[l].meeting[j]['specialities'][k]['speciality_id'] == specialityID) {
                    if (events[l].meeting[j].specialities[k].hasOwnProperty('patients')) {
                          let alreadyExists = false
                          let similarIndex = null
                          for (let m = 0; m < events[l].meeting[j]['specialities'][k]['patients'].length; m++) {
                              if (events[l].meeting[j]['specialities'][k]['patients'][m]['firstNames'] == patient['firstNames'] && events[l].meeting[j]['specialities'][k]['patients'][m]['lastNames'] == patient['lastNames'] && events[l].meeting[j]['specialities'][k]['patients'][m]['gender'] == patient['gender'] && events[l].meeting[j]['specialities'][k]['patients'][m]['dateOfBirth'] == patient['dateOfBirth']) {
                                similarIndex = m
                                if (events[l].meeting[j]['specialities'][k]['patients'][m]['patient_assignment_id'] == patient['patient_assignment_id']) {
                                      alreadyExists = true
                                }
                              }
                            }
                          if (!alreadyExists && similarIndex != null) {
                                events[l].meeting[j]['specialities'][k]['patients'].splice(similarIndex, 1)
                                events[l].meeting[j]['specialities'][k]['patients'].push(patient)
                              }
                            else if(!alreadyExists && similarIndex == null){
                              events[l].meeting[j]['specialities'][k]['patients'].push(patient)
                            }

                        } else {
                          events[l].meeting[j]['specialities'][k]['patients'] = []
                          events[l].meeting[j]['specialities'][k]['patients'].push(patient)
                        }
                  }
                }
              }
            }
          }
          that.setState({
            events: events
          })
        })
      }*/
    })
  },

  addPatients: function (patient, meeting2, specialty2, year, month, day) {
    let events = this.state.events
    let that = this
    const openEHRSessionId = this.props.openEHRSessionId
    const baseurl = 'http://peachteam35.uksouth.cloudapp.azure.com:8080/api/patient_assignments/'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const putURL = 'http://peachteam35.uksouth.cloudapp.azure.com:8080/api/referrals/'
                        // map through meeting
                    // map through specialty
    for (let i = 0; i < events.length; i++) {
      if (events[i].year === year && events[i].month === month && events[i].day === day) {
        for (let j = 0; j < events[i].meeting.length; j++) {
          if (_.isEqual(meeting2, events[i].meeting[j])) {
            for (let k = 0; k < events[i].meeting[j]['specialities'].length; k++) {
              if (events[i].meeting[j]['specialities'][k]['name'] === specialty2) {
                if (events[i].meeting[j]['specialities'][k].hasOwnProperty('patients')) {
                  events[i].meeting[j]['specialities'][k]['patients'].push(patient)
                  axios.post(baseurl, {
                    'PatientAssigment': {
                        'ehrID': patient['ehrID'],
                        'speciality_id': events[i].meeting[j]['specialities'][k]['speciality_id'],
                        'meeting_occurence_id': meeting2['meeting_occurence_id'],
                        'referral_id': patient['referral_id']

                      }
                  }, config).then(function (response) {
                      axios.put(putURL + patient['referral_id'], {
                          'Referral': {
                              'status': 1
                            }
                        }, config).then(function (response) {
                            that.setState({
                                events: events
                              })
                          })
                    })
                } else {
                  events[i].meeting[j]['specialities'][k]['patients'] = []
                  events[i].meeting[j]['specialities'][k]['patients'].push(patient)
                  axios.post(baseurl, {
                    'PatientAssigment': {
                        'ehrID': patient['ehrID'],
                        'speciality_id': events[i].meeting[j]['specialities'][k]['speciality_id'],
                        'meeting_occurence_id': meeting2['meeting_occurence_id'],
                        'referral_id': patient['referral_id']
                      }
                  }, config).then(function (response) {
                      axios.put(putURL + patient['referral_id'], {
                          'Referral': {
                              'status': 1
                            }
                        }, config).then(function (response) {
                            that.setState({
                                events: events
                              })
                          })
                    })
                }
              }
            }
          }
        }
      }
    }
        // theres no way theres a patient without meeting, REMOVE THIS
  },

  removeFromGrid: function (index, meeting2, specialty2, year, month, day) {
    let events = this.state.events
    let deleteURL = 'http://peachteam35.uksouth.cloudapp.azure.com:8080/api/patient_assignments/'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const putURL = 'http://peachteam35.uksouth.cloudapp.azure.com:8080/api/referrals/'

        // map through events
            // map through meetings
                // map through specialty
    for (let i = 0; i < events.length; i++) {
      if (events[i].year === year && events[i].month === month && events[i].day === day) {
        for (let j = 0; j < events[i].meeting.length; j++) {
          if (_.isEqual(meeting2, events[i].meeting[j])) {
            for (let k = 0; k < events[i].meeting[j]['specialities'].length; k++) {
              if (events[i].meeting[j]['specialities'][k]['name'] === specialty2) {
                let patient = events[i].meeting[j]['specialities'][k]['patients'][index]
                console.log(patient)
                console.log('PUTURL2', putURL + patient['referral_id'])
                console.log("Delete", deleteURL + patient['patient_assignment_id'] )
                axios.delete(deleteURL + patient['patient_assignment_id']).then(function (response) {
                  axios.put(putURL + patient['referral_id'], {
                    "Referral": {
                        "status": 0
                      }
                  }, config)
                })
                events[i].meeting[j]['specialities'][k]['patients'].splice(index, 1)
              }
            }
          }
        }
      }
    }
    this.setState({
      events: events
    })
  },

  render: function () {
    return (
      <div className={styles.rcalendar}>
        <div className='rinner'>
          <Header monthNames={this.state.monthNamesFull} month={this.state.month} year={this.state.year} onPrev={this.getPrev} onNext={this.getNext} />
          <WeekDays dayNames={this.state.dayNames} startDay={this.state.startDay} weekNumbers={this.state.weekNumbers} />
          <MonthDates events={this.state.events} hasFinishedLoading={this.state.hasFinishedLoading} getPatients={this.getPatients} removeFromGrid={this.removeFromGrid} addPatients={this.addPatients} addPatient={this.props.addPatient} month={this.state.month} year={this.state.year} daysInMonth={this.state.daysInMonth} firstOfMonth={this.state.firstOfMonth} startDay={this.state.startDay} onSelect={this.selectDate} weekNumbers={this.state.weekNumbers} disablePast={this.state.disablePast} minDate={this.state.minDate} />
        </div>
      </div>
    )
  }
})

let Header = React.createClass({
  render: function () {
    return (
      <div className='rrow rhead'>
        <div className={'rcell ' + styles.greyhover} onClick={this.props.onPrev.bind(null, this)} role='button' tabIndex='0'><i className='fa fa-caret-left' aria-hidden='true' /></div>
        <div className='rcell'>{this.props.monthNames[this.props.month]}&nbsp;{this.props.year}</div>
        <div className={'rcell ' + styles.greyhover} onClick={this.props.onNext.bind(null, this)} role='button' tabIndex='0'><i className='fa fa-caret-right' aria-hidden='true' /></div>
      </div>
    )
  }
})

let WeekDays = React.createClass({
  render: function () {
    let that = this,
      haystack = Array.apply(null, {length: 7}).map(Number.call, Number)
    return (
      <div className={'rrow rweekdays'}>
        {(() => {
          if (that.props.weekNumbers) {
            return (
              <div className='rcell rweeknum'>wn</div>
            )
          }
        })()}
        {haystack.map(function (item, i) {
          return (
            <div className='rcell'>{that.props.dayNames[(that.props.startDay + i) % 7]}</div>
          )
        })}
      </div>
    )
  }
})

let MonthDates = React.createClass({
  statics: {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    date: new Date().getDate(),
    today: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  },

  render: function () {
    let haystack, day, d, current, onClick,
      isDate, className,
      weekStack = Array.apply(null, {length: 7}).map(Number.call, Number),
      that = this,
      startDay = this.props.firstOfMonth.getUTCDay(),
      first = this.props.firstOfMonth.getDay(),
      janOne = new Date(that.props.year, 0, 1),
      rows = 5

    if ((startDay == 5 && this.props.daysInMonth == 31) || (startDay == 6 && this.props.daysInMonth > 29)) {
      rows = 6
    }

    className = rows === 6 ? 'rdates' : 'rdates rfix'   // todo:check
    haystack = Array.apply(null, {length: rows}).map(Number.call, Number)
    day = this.props.startDay + 1 - first
    while (day > 1) {
      day -= 7
    }
    day -= 1
    return (
      <div className={className}>
        {haystack.map(function (item, i) {
          d = day + i * 7
          return (
            <div className='rrow'>
              {(() => {
                if (that.props.weekNumbers) {
                  let wn = Math.ceil((((new Date(that.props.year, that.props.month, d) - janOne) / 86400000) + janOne.getDay() + 1) / 7)
                  return (
                    <div className='rcell rweeknum'>{wn}</div>
                  )
                }
              })()}
              {weekStack.map(function (item, i) {
                d += 1
                isDate = d > 0 && d <= that.props.daysInMonth

                if (isDate) {
                  current = new Date(that.props.year, that.props.month, d)
                  className = current != that.constructor.today ? ' rcell rdate ' : ' rcell rdate rtoday '
                  if (that.props.disablePast && current < that.constructor.today) {
                    className += ' rpast'
                  } else if (that.props.minDate !== null && current < that.props.minDate) {
                        className += ' rpast'
                      }
                            // change meetingA/B/C to meetings array
                  let dayEvent = {
                    year: 0,
                    month: 0,
                    day: 0,
                    meeting: []
                  }
                  let events = that.props.events
                  for (let i = 0; i < events.length; i++) {
                    if (events[i].year === that.props.year && events[i].month === that.props.month && events[i].day === d) {
                          dayEvent = events[i]
                        }
                  }

                  if (/r-past/.test(className)) {
                    return (
                          <div className={className} role='button' tabIndex='0'><Grid year={that.props.year} month={that.props.month} day={d} addPatient={that.props.addPatient}>{d}</Grid></div>
                        )
                  }

                  return (
                    <div className={className} role='button' tabIndex='0' onClick={that.props.onSelect.bind(null, that, that.props.year, that.props.month, d)}><Grid hasFinishedLoading={that.props.hasFinishedLoading} dayEvent={dayEvent} getPatients={that.props.getPatients} removeFromGrid={that.props.removeFromGrid} addPatients={that.props.addPatients} year={that.props.year} month={that.props.month} day={d} addPatient={that.props.addPatient}>{d}</Grid></div>

                  )
                }

                return (
                  <div className='rcell' />
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
})

const styles = {
  rcalendar: css({
    backgroundColor: '#eee',
    font: 'normal 15px Helvetica Neue, Helvetica, Arial, sans-serif',
    minWidth: '280px',
    borderRadius: '3px',
    border: '1px solid #ddd',
    marginBottom: '25PX',
    position: 'relative',
    width: '100%',
    marginRight: '0px',
    marginLeft: '0px',
    height: '90vh',
    '& *': {
      MozBoxSizing: 'border-box',
      WebkitBoxSizing: 'border-box',
      boxSizing: 'border-box',
      MozTransition: 'all 0.3s linear',
      WebkitTransition: 'all 0.3s linear',
      OTransition: 'all 0.3s linear',
      transition: 'all 0.3s linear'
    },
    '& .rinner': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexFlow: 'column nowrap'
    },
    '& .rrow': {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: '100%',
      justifyContent: 'center'
    },
    '& .rhead': {
      flexGrow: 0.33,
      flexBasis: 0
    },
    '& .rprev': {
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      outline: 'none'
    },
    '& .rnext': {
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      outline: 'none'
    },
    '& .rcell': {
      backgroundColor: '#ffffff',
      alignItems: 'center',
      display: 'flex',
      flexFlow: 'row nowrap',
      flexGrow: 1,
      flexBasis: 0,
      justifyContent: 'center',
      wordWrap: 'break-word',
      overflowWrap: 'break-word'
    },
    '& .rweekdays': {
      flexGrow: 0.33,
      flexBasis: 0
    },
    '& .rweekdays .rcell': {
      fontWeight: 'bold'
    },
    '& .rweeknum': {
      color: '#999999',
      fontSize: ' 0.8em'
    },
    '& .rdates': {
      display: 'flex',
      flexFlow: 'column nowrap',
      flexGrow: 6,
      flexBasis: 0
    },
    '& .rdates .rrow': {
      flexGrow: 1
    },
    '& .rdates .rcell ': {
      backgroundColor: '#ffffff',
      border: 'solid 1px #ffffff'
    },
    '& .rcell.rdate.r-today ': {
      backgroundColor: '#ffffff',
      border: 'solid 1px #0066CC'
    },
    '& .rcell.rdate:not(.rpast):hover ': {
      backgroundColor: '#0066CC',
      border: 'solid 1px #0066CC'
    },
    '& .rcell.rdate.rselected ': {
      backgroundColor: '#000000',
      border: 'solid 1px #000000',
      color: '#fff'
    },
    '& .rcell.rdate.rpast ': {
      color: '#999999',
      cursor: 'not-allowed'
    },
    '& .rdates.rfix': {
      flexGrow: 5
    },
    '& .rcell.rdate': {
      cursor: 'pointer',
      outline: 'none'
    },
    ':after': {
      content: '',
      display: 'block',
      paddingBottom: '100%'
    }
  }

    ),
  greyhover: css({
    ':hover': {
      backgroundColor: '#f5f5f5',
      borderRadius: '3px'
    }
  })
}

export default Calendar
