import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MapPicker from './MapPicker';
import uuid from 'uuid/v4';
import moment from 'moment';
import {find} from 'lodash';
import {observer} from 'mobx-react';
import timeAllocation from '../../timeAllocation';

export default
@observer
class MySchedule extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newTruckName: "",
      dialogOpen: false,
      selectedTruckId: this.props.myTrucks[0].id,
      newTruckMass: "",
      newTruckLat: null,
      newTruckLng: null,
      time: new Date()
    };
  };
  handleLatLng = (marker) => {
    this.setState({
      newTruckLat: marker.lat(),
      newTruckLng: marker.lng()
    });
  };
  render() {
    const selectedTruck = _.find(this.props.myTrucks, {id: this.state.selectedTruckId});
    const RenderMyTrucks = () => {
      return (
        <Menu
          style={{width: "20%", borderRight: '1px solid rgb(0, 188, 212)', backgroundColor: "#f3feff"}}
        >
          {this.props.myTrucks.map(truck => {
            return (
              <div key={truck.id}>
                <MenuItem
                  primaryText={truck.name}
                  onClick={() => {this.setState({selectedTruckId: truck.id})}}
                  style={{ borderBottom: '1px solid #DEDEDE'}}
                />
              </div>
            );
          })}
        </Menu>
      );
    };
    const Actions = [
      <FlatButton
        label="cancel"
        primary={true}
        onTouchTap={() => this.setState({dialogOpen: false})}
      />,
      <FlatButton
        label="save"
        primary={true}
        onTouchTap={() => {
          const newTruck = {
            id: uuid(),
            name: this.state.newTruckName,
            mass: this.state.newTruckMass,
            positionLat: this.state.newTruckLat,
            positionLang: this.state.newTruckLng,
            time: this.state.time
          };
          timeAllocation(this.props.myTrucks, newTruck, this, this.state.time);
        }}
      />
    ];
    const TruckInfo = () => {
      return(
        <div style={{width: "85%"}}>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn style={{textAlign: "center"}}>
                ID
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                {selectedTruck.id}
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            <TableRow>
              <TableRowColumn style={{textAlign: "center"}}>
                Name
              </TableRowColumn>
              <TableRowColumn style={{textAlign: "center"}}>
                {selectedTruck.name}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn style={{textAlign: "center"}}>
                Mass
              </TableRowColumn>
              <TableRowColumn style={{textAlign: "center"}}>
                {selectedTruck.mass}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn style={{textAlign: "center"}}>
                Time
              </TableRowColumn>
              <TableRowColumn style={{textAlign: "center"}}>
                {
                  moment(selectedTruck.time).format("h:mm a, Do MMMM")
                }
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn style={{textAlign: "center"}}>
                Latitude
              </TableRowColumn>
              <TableRowColumn style={{textAlign: "center"}}>
                {selectedTruck.positionLat}
              </TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn style={{textAlign: "center"}}>
                Longtitude
              </TableRowColumn>
              <TableRowColumn style={{textAlign: "center"}}>
                {selectedTruck.positionLang}
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
        </div>
      );
    };
    return (
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <RenderMyTrucks />
        <TextField
          style={{position: "fixed", bottom: "0", width: "15%"}}
          floatingLabelText="Add New Truck"
          name="New Truck"
          value={this.state.newTruckName}
          onChange={e => this.setState({newTruckName: e.target.value})}
        />
        <FlatButton
          label="add"
          style={{width: "5%", position: "fixed", bottom: "0", left: "15%"}}
          onTouchTap={() => {this.setState({dialogOpen: true});}}
        />
        <TruckInfo />
        <Dialog
          open={this.state.dialogOpen}
          actions={Actions}
        >
          <TextField
            name="New Dialog Truck"
            floatingLabelText="Name"
            fullWidth={true}
            value={this.state.newTruckName}
            onChange={e => this.setState({newTruckName: e.target.value})}
          />
          <TextField
            name="New Truck Mass"
            floatingLabelText="Mass"
            fullWidth={true}
            value={this.state.newTruckMass}
            onChange={e => this.setState({newTruckMass: e.target.value})}
          />
          <DatePicker
            name="Pick Date"
            hintText="Pick Comfortable Date"
            value={this.state.time}
            onChange={(e, newDate) => {
              const o = this.state.time;
              const n = newDate;
              const time = new Date(n.getFullYear(), n.getMonth(), n.getDate(), o.getHours(), o.getMinutes());
              this.setState({time});
            }}
          />
          <TimePicker
            name="Pick Time"
            hintText="Pick Comfortable Time"
            value={this.state.time}
            onChange={(e, newTime) => {
              const o = this.state.time;
              const n = newTime;
              const time = new Date(o.getFullYear(), o.getMonth(), o.getDate(), n.getHours(), n.getMinutes());
              this.setState({time});
            }}
          />
          <MapPicker
            marker={{
              lat: this.state.newTruckLat,
              lng: this.state.newTruckLng
            }}
            handleLatLng={this.handleLatLng}
          />
        </Dialog>
      </div>
    );
  };
};
