import * as React from "react";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";


// let ftpUrl =
//   "http://ftp.gallatin.mt.gov/Commission%20Minutes/Commissioner%20Journals/";


const styles = (theme) => ({

});

interface ViewerState  {
  update: ()=>void  
}


class Viewer extends React.Component<{ classes,selection?:{href?:string},ref?:any },ViewerState> {
  constructor(props) {
    super(props);    
  }


  update(){
    console.log('im here')
  }

  async componentDidMount() {
    const image = 'an image';
    this.setState({update: this.update});
  }

  render() {
    const { classes } = this.props;

    return (
    <div><h2>{this.props?.selection?.href ? this.props?.selection?.href:'none found'}</h2></div>
    );
  }
}


export default withStyles(styles, { withTheme: true })(Viewer);
