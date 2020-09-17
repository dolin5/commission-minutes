import * as React from "react";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Tiff from "tiff.js";

// let ftpUrl =
//   "http://ftp.gallatin.mt.gov/Commission%20Minutes/Commissioner%20Journals/";

const styles = (theme) => ({});

interface ViewerState {
  update: () => void;
  selected: {
    href?: string;
  };
  loading: boolean;
  canvas: HTMLCanvasElement;
}

async function getTiffCanvas(href: string):Promise<HTMLCanvasElement> {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", href);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (e) {
      var buffer = xhr.response;
      var tiff = new Tiff({ buffer: buffer });
      var width = tiff.width();
      var height = tiff.height();
      var canvas = tiff.toCanvas();
      resolve(canvas);
    };
    xhr.send();
  });
}

class Viewer extends React.Component<
  { classes; selected?: { href?: string }; ref?: any },
  ViewerState
> {
  constructor(props) {
    super(props);
  }

  async update(content) {
    this.setState({ loading: true });
    const href = 'http://ftp.gallatin.mt.gov'+content?.href;
    let canvas = await getTiffCanvas(href);
    (this.refs.canvasRef as HTMLCanvasElement).width = canvas.width;
    (this.refs.canvasRef as HTMLCanvasElement).height = canvas.height;
    let ctx =(this.refs.canvasRef as HTMLCanvasElement).getContext('2d')
    ctx?.drawImage( canvas,0,0)

    //this.setState({ canvas, loading: false });
  }

  async componentDidMount() {
    const image = "an image";
    this.setState({ loading: false });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <CircularProgress hidden={!this.state?.loading}></CircularProgress>
        <canvas ref="canvasRef"/>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Viewer);
