import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { Tabs, Tab } from 'material-ui/Tabs';
import Subheader from 'material-ui/Subheader';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';

import logo from './logo.svg';
import './App.css';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
      clients: ttracker
    }
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            title="tTracker"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonTouchTap={() => this.setState({ menuOpen: !this.state.menuOpen })}
          />
          <div>
            <Drawer open={this.state.menuOpen}
              onRequestChange={(open) => this.setState({ menuOpen: open })} docked={false}>
              <MenuItem>Menu Item</MenuItem>
              <MenuItem>Menu Item 2</MenuItem>
            </Drawer>
            <Tabs>
              <Tab label="Clients" >
                <Card>
                  <CardHeader
                    title="Client Name 1"
                    actAsExpander={true}
                    showExpandableButton={true}
                  />
                  <CardActions>
                    <FlatButton label="Edit" icon={<EditIcon />} />
                    <FlatButton label="Delete" icon={<DeleteIcon />} />
                  </CardActions>
                  <CardText expandable={true}>
                  <Subheader>Last billed date</Subheader>
                  <p>1/1/2017</p>
                  <Subheader>Next invoice subtotal</Subheader>
                  <p>€ 1,000</p>
                    <Subheader>Projects 
                      <FlatButton
                        icon={<ContentAdd />}
                      />
                    </Subheader>
                    <div style={styles.wrapper}>
                    <Chip
                      style={styles.chip}
                      onRequestDelete={() => {}}
                      
                    >
                    project1
                  </Chip>
                  <Chip
                      style={styles.chip}
                      onRequestDelete={() => {}}
                      
                    >
                    project2
                  </Chip>
                  </div>
                
                  </CardText>
                </Card>

                <Card>
                  <CardHeader
                    title="Client Name 2"
                    actAsExpander={true}
                    showExpandableButton={true}
                  />
                  <CardActions>
                    <FlatButton label="Edit" icon={<EditIcon />} />
                    <FlatButton label="Delete" icon={<DeleteIcon />} />
                  </CardActions>
                  <CardText expandable={true}>
                  <Subheader>Last billed date</Subheader>
                  <p>1/1/2017</p>
                  <Subheader>Next invoice subtotal</Subheader>
                  <p>€ 1,000</p>
                    <Subheader>Projects</Subheader>
                    <div style={styles.wrapper}>
                    <Chip
                      style={styles.chip}
                      onRequestDelete={() => {}}
                    >
                    project1
                  </Chip>
                  <Chip
                      style={styles.chip}
                      onRequestDelete={() => {}}
                    >
                    project2
                  </Chip>
                  </div>
                  </CardText>
                </Card>
              </Tab>
              <Tab
                label="Projects"
              >
              <Card>
                  <CardHeader
                    title="Project Name 1"
                    subtitle="Client Name"
                    actAsExpander={true}
                    showExpandableButton={true}
                  />
                  <CardActions>
                    <FlatButton label="Edit" icon={<EditIcon />} />
                    <FlatButton label="Delete" icon={<DeleteIcon />} />
                  </CardActions>
                  <CardText expandable={true}>
                  <Subheader>Total time</Subheader>
                  <p>22 hrs</p>
                  <Subheader>Total cost</Subheader>
                  <p>€ 1,000</p>
                  <Subheader>Last billed date</Subheader>
                  <p>1/1/2017</p>
                  <Subheader>Next invoice subtotal</Subheader>
                  <p>€ 1,000</p>
                  <Subheader>Tasks</Subheader>
                    <div style={styles.wrapper}>
                    <Chip
                      style={styles.chip}
                      onRequestDelete={() => {}}
                      
                    >
                    task1
                  </Chip>
                  <Chip
                      style={styles.chip}
                      onRequestDelete={() => {}}
                      
                    >
                    task2
                  </Chip>
                  </div>
                  <Subheader>Time entries</Subheader>
                  <Table>
    <TableHeader
    adjustForCheckbox={false}
    >
      <TableRow>
        <TableHeaderColumn>Start time</TableHeaderColumn>
        <TableHeaderColumn>End time</TableHeaderColumn>
        <TableHeaderColumn>Duration</TableHeaderColumn>
        <TableHeaderColumn>Cost</TableHeaderColumn>
        <TableHeaderColumn>Edit</TableHeaderColumn>
        <TableHeaderColumn>Delete</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableRowColumn>1/1/2017 16:00</TableRowColumn>
        <TableRowColumn>1/1/2017 17:00</TableRowColumn>
        <TableRowColumn>1 hr</TableRowColumn>
        <TableRowColumn>€ 10</TableRowColumn>
        <TableRowColumn><EditIcon/></TableRowColumn>
        <TableRowColumn><DeleteIcon/></TableRowColumn>
      </TableRow>
      <TableRow>
      <TableRowColumn>1/2/2017 16:00</TableRowColumn>
      <TableRowColumn>1/2/2017 17:00</TableRowColumn>
      <TableRowColumn>1 hr</TableRowColumn>
      <TableRowColumn>€ 10</TableRowColumn>
      <TableRowColumn><EditIcon/></TableRowColumn>
      <TableRowColumn><DeleteIcon/></TableRowColumn>
      </TableRow>
    </TableBody>
  </Table>
                  </CardText>
                </Card>

                <Card>
                  <CardHeader
                    title="Project Name 2"
                    subtitle="Client Name"
                    actAsExpander={true}
                    showExpandableButton={true}
                  />
                  <CardActions>
                    <FlatButton label="Edit" icon={<EditIcon />} />
                    <FlatButton label="Delete" icon={<DeleteIcon />} />
                  </CardActions>
                  <CardText expandable={true}>
                  <Subheader>Last billed date</Subheader>
                  <p>1/1/2017</p>
                  <Subheader>Next invoice subtotal</Subheader>
                  <p>€ 1,000</p>
                    <Subheader>Projects</Subheader>
                    <div style={styles.wrapper}>
                    <Chip
                      style={styles.chip}
                    >
                    project1
                  </Chip>
                  <Chip
                      style={styles.chip}
                    >
                    project2
                  </Chip>
                  </div>
                  </CardText>
                </Card>

              </Tab>
            </Tabs>
          </div>
          <FloatingActionButton style={{
            position: 'absolute',
            right: '2em',
            bottom: '2em'
          }}>
            <ContentAdd />
          </FloatingActionButton>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
