import * as React from "react";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import Title from "./dashboard/Title";

import { mapDOM } from "./utils/html";

let ftpUrl =
  "http://ftp.gallatin.mt.gov/Commission%20Minutes/Commissioner%20Journals/";

interface content {
  href: string;
  label: string;
  sequenceNum: number;
}
interface book extends content {
  subDir: content[];
  pages: content[][];
}

const styles = (theme) => ({
  drawerElement: {
    marginLeft: "20px"    
  },
  listScroll:{
    height: "89vh",
    overflowY: "scroll" as "scroll"
  }
});

async function getBooks(): Promise<book[]> {
  let commissionMinutes = (await getBook(ftpUrl)) as book[];
  commissionMinutes.sort(bookSort);
  (commissionMinutes as book[]).forEach((cM) => {
    cM.subDir.sort(bookSort);
    cM.pages = cM.subDir.reduce((resultArray: content[][], item, index) => {
      const chunkIndex = Math.floor(item.sequenceNum / 100);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);
  });

  return commissionMinutes;
}

async function getBook(url): Promise<(book | content)[]> {
  let response = await fetch(url);
  let element = document.createElement("div");
  element.innerHTML = await response.text();
  let content = (await Promise.all(
    (mapDOM(element, true) as any).content
      .find((c) => c.type === "PRE")
      .content.filter(
        (c) =>
          typeof c === "object" &&
          c.type !== "BR" &&
          c.content[0] !== "[To Parent Directory]"
      )
      .map(async (c) => {
        let subDir: content[] = [];
        if (c.attributes?.href.endsWith("/")) {
          subDir = await getBook(
            url +
              c.attributes.href
                .split("/")
                .filter((s) => s.length > 0)
                .pop()
          );
        }
        let label, sequenceNum;
        try {
          if ((c.content[0] as string).match(/(?:_PG)[0-9]+/)) {
            sequenceNum = parseInt(
              (c.content[0] as string).match(/(?<=_PG)([0-9]+)/)?.[0] as string
            );
            label = "Pg " + sequenceNum;
          } else if ((c.content[0] as string).match(/(?:Book )[0-9]+/i)) {
            sequenceNum = parseInt(
              (c.content[0] as string).match(
                /(?<=Book )([0-9]+)/i
              )?.[0] as string
            );
            label = "Book " + sequenceNum;
          } else {
            label = c.content[0];
            sequenceNum = 99999;
          }
        } catch {
          label = c.content[0];
          sequenceNum = 99999;
        }

        let book = {
          label: label ? label : c.content[0],
          sequenceNum,
          href: c.attributes?.href,
          subDir,
        };
        return book;
      })
  )) as content[];
  return content;
}

function bookSort(bookA: content, bookB: content) {
  return bookA.sequenceNum - bookB.sequenceNum;
}

class BookTree extends React.Component<{ classes: any }, { books: any[] }> {
  constructor(props) {
    super(props);
    this.state = { books: [] };
    //this.classes = useStyles();
  }
  pageClick(targetPage:content){
    console.log(targetPage);
  }
  async componentDidMount() {
    const response = await getBooks();
    console.log(response);
    let books = response.map((b, i) => {
      return (
        <TreeItem
          nodeId={"Bk-" + b + "-" + i}
          key={"Bk-" + b + "-" + i}
          label={b.label}
        >
          {b.pages.map((g, j) => {
            return <TreeItem
              nodeId={"Bk-" + b + "-" + i + " G-" + j}
              key={"Bk-" + b + "-" + i + " G-" + j}
              label={
                g[0].sequenceNum.toString() +
                " - " +
                g[g.length - 1].sequenceNum
              }
            >
              {(b as book).pages[j]?.map((p, k) => {
                return (
                  <TreeItem
                    nodeId={
                      "Bk-" + b + "-" + i + " G-" + j + " Pg-" + p + "-" + k
                    }
                    key={"Bk-" + b + "-" + i + " G-" + j + " Pg-" + p + "-" + k}
                    label={p.label}
                    onClick={(e)=>{
                      e.preventDefault()
                       this.pageClick(p)
                    }}
                  />
                );
              })}
            </TreeItem>;
          })}
        </TreeItem>
      );
    });

    this.setState({
      books,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.drawerElement}>
        <Title>Books</Title>
        <TreeView
        className={classes.listScroll}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {this.state.books}
        </TreeView>
      </div>
    );
  }
}

//export default BookTree;

export default withStyles(styles, { withTheme: true })(BookTree);
// // Generate Order Data
// function createData(
//   id: number,
//   date: string,
//   name: string,
//   shipTo: string,
//   paymentMethod: string,
//   amount: number,
// ) {
//   return { id, date, name, shipTo, paymentMethod, amount };
// }

// async function getBooks(){
//   //const results = getJournalPagesAsJSON('http://ftp.gallatin.mt.gov/Commission%20Minutes/Commissioner%20Journals');
//   return [];
// }

// function preventDefault(event: React.MouseEvent) {
//   event.preventDefault();
// }

// const useStyles = makeStyles((theme) => ({
//   seeMore: {
//     marginTop: theme.spacing(3),
//   },
//   root: {
//     marginLeft:theme.spacing(2)
//   },
//   overFlow: {
//     overflow:'auto'
//   }

// }));

// export default  function BookTree() {
//   const [books, setBooks] = React.useState("");

//   React.useEffect(() => {
//     const fetchBooks = async () => {
//       const bookResponse = await getBooks();
//         let bookComponents = bookResponse?.map((b,i)=>{
//         return <TreeItem key={'B-'+i} nodeId={'B-'+i} label={(b as treeObject)?.content?.[0]}>
//           {
//             b?.subDir.map((sD,j)=>{
//               return <TreeItem key={'B-'+i+'-P'+j} nodeId={'B-'+i+'-P'+j} label={sD.content[0]}/>
//             })
//           }
//         </TreeItem>
//       })
//       //const { email } = await response.json();
//       setBooks(bookComponents);
//     };
//     fetchBooks();
//   }, []);
//   const classes = useStyles();
//   return (
//     <div
//     className={classes.root}>
//       <Title>Books</Title>
//       <TreeView className={classes.overFlow}
//       defaultCollapseIcon={<ExpandMoreIcon />}
//       defaultExpandIcon={<ChevronRightIcon />}
//     >{books}
//     </TreeView>
//       <div className={classes.seeMore}>
//         <Link color="primary" href="#" onClick={preventDefault}>
//           See more orders
//         </Link>
//       </div>
//     </div>
//   );
// }
