import React from 'react';
import { connect } from 'react-redux';

import {
  updateSearch,
} from '../actions';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';

const mapStateToProps = (state) => ({
  searchText: state.ui.searchText,
});

const mapDispatchToProps = (dispatch) => ({
  updateSearch: (text) => dispatch(updateSearch(text)),
});

const SearchBox = ({
      searchText,
      updateSearch,
    }) => (<div>
      <TextField
        value={searchText}
        floatingLabelText="Search by name"
        onChange={(e) => updateSearch(e.target.value)}  
      />
      <IconButton
        onClick={() => updateSearch('')}
      >
        <ContentClear/>
      </IconButton>
    </div>);

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
