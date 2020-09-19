import * as React from "react";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
//import Tiff from "tiff.js";
import "viewerjs/dist/viewer.css";
import ViewerJS from "viewerjs";
import dog from "./dog.jpg";
import otherDog from "./other-dog.jpg";
import UTIF from "utif";

// let ftpUrl =
//   "http://ftp.gallatin.mt.gov/Commission%20Minutes/Commissioner%20Journals/";

const styles = (theme) => ({
  viewerHeight:{
    minHeight:'81vh'
  }
});

interface ViewerState {
  update: () => void;
  selected: {
    href?: string;
  };
  loading: boolean;
  canvas: HTMLCanvasElement;
}

const blob2ArrayBuffer = (blob) =>
  new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.addEventListener("loadend", () => resolve(reader.result));
    reader.readAsArrayBuffer(blob);
  });

const tiffArrayBufferToImageData = (buffer) => {
  const ifds = UTIF.decode(buffer);
  UTIF.decodeImages(buffer, ifds);
  const timage = ifds[0];
  const array = new Uint8ClampedArray(UTIF.toRGBA8(timage));
  return new ImageData(array, timage.width, timage.height);
};
//const getTiffImageData = async (image) =>
//  blob2ArrayBuffer(image).then(tiffArrayBufferToImageData);

// async function getTiffCanvas(href: string): Promise<HTMLCanvasElement> {
//   return new Promise(function (resolve, reject) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", href);
//     xhr.responseType = "arraybuffer";
//     xhr.onload = function (e) {
//       var buffer = xhr.response;
//       const ifds = UTIF.decode(buffer);
//       var tiff = new Tiff({ buffer: buffer });
//       var width = tiff.width();
//       var height = tiff.height();
//       var canvas = tiff.toCanvas();
//       resolve(canvas);
//     };
//     xhr.send();
//   });
// }

// async function getTiffImage(href: string): Promise<string> {
//   return new Promise(function (resolve, reject) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", href);
//     xhr.responseType = "arraybuffer";
//     xhr.onload = function (e) {
//       var buffer = xhr.response;
//       var tiff = new Tiff({ buffer: buffer });
//       let aB = tiff.readRGBAImage();
//       console.log(otherDog);
//       var blob = new Blob([aB], { type: "image/jpeg" });
//       var urlCreator = window.URL || window.webkitURL;
//       var imageUrl = urlCreator.createObjectURL(blob);

//       resolve(imageUrl);
//     };
//     xhr.send();
//   });
// }

async function getImage(href: string) {
  let response = await fetch(href);
  return response.body;
}

class Viewer extends React.Component<
  { classes; selected?: { href?: string }; ref?: any },
  ViewerState
> {
  viewer: ViewerJS | undefined;
  viewerRef: React.RefObject<HTMLImageElement>;
  imageUrl: string;
  otherImageRef: React.RefObject<HTMLImageElement>;
  constructor(props) {
    super(props);
    this.viewerRef = React.createRef();
    this.otherImageRef = React.createRef();
    this.imageUrl = "./dog.jpg";
  }

  async update(content) {
    this.setState({ loading: true });
    const href = "http://ftp.gallatin.mt.gov" + content?.href;
    if (this) {
      this.viewerRef.current.src = href;
    }
    UTIF.replaceIMG();
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = new ViewerJS(this.viewerRef.current as Element, {
        inline: true,
      });
    }
    this.setState({ loading: false });
  }

  async componentDidMount() {
    const image = "an image";
    // this.viewer = new ViewerJS(this.viewerRef.current as Element, {
    //   inline: true,
    // });
    UTIF.replaceIMG();
    this.viewer = new ViewerJS(this.viewerRef.current as Element, {
      inline: true,
    });
    this.setState({ loading: false });
  }

  componentDidUpdate(){
    this.viewerRef.current.hidden = true;
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.viewerHeight}>
          {/* <img ref={this.viewerRef} src={dog}></img> */}
          <img
            ref={this.viewerRef}
            src="http://ftp.gallatin.mt.gov/Commission%20Minutes/Commissioner%20Journals/Book%2011/BK11_PG004.tif"
          ></img>

      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Viewer);
