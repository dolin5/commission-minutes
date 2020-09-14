import * as React from "react";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

import Title from "./dashboard/Title";

import { mapDOM } from "./utils/html";

let ftpUrl =
  "http://ftp.gallatin.mt.gov/Commission%20Minutes/Commissioner%20Journals/";

async function getBooks() {
  let commissionMinutes = getBook(ftpUrl);

  return "fuck";
}

async function getBook(url) {
  let response = await fetch(url);
  let element = document.createElement("div");
  element.innerHTML = await response.text();
  let content = (mapDOM(element, true) as any).content
    .find((c) => c.type === "PRE")
    .content.filter((c) => typeof c === "object" && c.type !=='BR')
    .map((c) => {
      let content = {
        label: c.content[0],
      };
      return content;
    });
  return content;
}

class BookTree extends React.Component<{}, { books: any[] }> {
  constructor(props) {
    super(props);
    this.state = { books: [] };
  }
  async componentDidMount() {
    const response = await getBooks();
    console.log(response);
    this.setState({
      books: [
        <TreeItem nodeId="fuck" key="fuck" label="Fuck">
          <TreeItem nodeId="shit" key="shit" label="Shit"></TreeItem>
        </TreeItem>,
      ],
    });
  }

  render() {
    return (
      <div>
        <Title>Books</Title>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {this.state.books}
        </TreeView>
      </div>
    );
  }
}

export default BookTree;
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
