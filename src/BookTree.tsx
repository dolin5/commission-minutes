import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import Link from '@material-ui/core/Link';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './dashboard/Title';

import {mapDOM, getJournalPagesAsJSON} from './utils/html';

// Generate Order Data
function createData(
  id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number,
) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

async function getBooks(){
  const results = getJournalPagesAsJSON('http://ftp.gallatin.mt.gov/Commission%20Minutes/Commissioner%20Journals');
  return results;
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  root: {
    marginLeft:theme.spacing(2)
  },
  overFlow: {
    overflow:'auto'
  }
  
}));

export default  function BookTree() {
  const [books, setBooks] = React.useState("");
  
  React.useEffect(() => {
    const fetchBooks = async () => {
      const bookResponse = await getBooks();
        let bookComponents = bookResponse?.map((b,i)=>{
        return <TreeItem key={'B-'+i} nodeId={'B-'+i} label={b.content[0]}>
          {
            b?.subDir.map((sD,j)=>{
              return <TreeItem key={'B-'+i+'-P'+j} nodeId={'B-'+i+'-P'+j} label={sD.content[0]}/>
            })
          }
        </TreeItem>
      })
      //const { email } = await response.json();
      setBooks(bookComponents);
    };
    fetchBooks();
  }, []);
  const classes = useStyles();
  return (    
    <div
    className={classes.root}>
      <Title>Books</Title>      
      <TreeView className={classes.overFlow}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >{books}
    </TreeView>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </div>
  );
}
