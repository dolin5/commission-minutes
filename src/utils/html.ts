interface treeObject {
  type?:string;
  content?:(treeObject|string|null)[];
  attributes?:any;
  destination?:string;
  subDir?:(treeObject|string|null)[];
}
export function mapDOM(element:HTMLElement, json:boolean) {
  var treeObject = {};
  // If string convert to document Node
  if (typeof element === "string") {
      let docNode
      if (window.DOMParser) {
            let parser = new DOMParser();
            docNode = parser.parseFromString(element,"text/xml");
      } else { // Microsoft strikes again
            docNode = new ActiveXObject("Microsoft.XMLDOM");
            docNode.async = false;
            docNode.loadXML(element); 
      } 
      element = docNode.firstChild;
  }
  //Recursively loop through DOM elements and assign properties to object
  function treeHTML(element:HTMLElement, object:treeObject) {
      object["type"] = element.nodeName;
      var nodeList = element.childNodes;
      if (nodeList != null) {
          if (nodeList.length) {
              object["content"] = [];
              for (let i = 0; i < nodeList.length; i++) {
                  if (nodeList[i].nodeType === 3) {
                      object["content"].push(nodeList[i].nodeValue);
                  } else {
                      object["content"].push({});
                      treeHTML(nodeList[i] as HTMLElement, object["content"][object["content"].length -1] as treeObject);
                  }
              }
          }
      }
      if ((element as HTMLElement).attributes != null) {
          if (element.attributes.length) {
              object["attributes"] = {};
              for (let i = 0; i < element.attributes.length; i++) {
                  object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue as unknown;
              }
          }
      }
  }
  treeHTML(element, treeObject);
  return (json) ?  treeObject:JSON.stringify(treeObject) ;
}

export async function getJournalPagesAsJSON(url:string){
    const element = await fetchJournalPage(url);    
    const links = await getLinks(mapDOM(element,true))

    let directories = links?.filter(l=>{
        return l.destination === 'directory';
    })
    await Promise.all(directories.map(d=>{
        return new Promise(async(res,rej)=>{
            try {

                const element = await fetchJournalPage([url,(d.attributes.href).split('/')[3]].join('/'));    
                const result = await getLinks(mapDOM(element,true))
                d.subDir = result
                res(result)
            }
            catch(e){
                rej(e)
            }            
        })
    }))
    return directories;
}

async function fetchJournalPage(url:string){
    const results = await fetch(url);
    let element = document.createElement('div');
    element.innerHTML = await results?.text()
    return element;
}

async function getLinks(tree:treeObject){
    let content = (tree.content?.filter(c=>{
        return (c as treeObject).type === 'PRE';
    })[0] as treeObject).content
    let contentArray = content?.map((c,i)=>{
        let designation=typeof content?.[i-1] === 'string'? (content?.[i-1] as string).split(' ').filter(i=>i).slice(-1)[0]:'';
        if (c && typeof c == 'object'){
            //if 
            c.destination = designation === '<dir>'?'directory':'file';
        }
        return c;
    }).filter((c,i)=>{
        return (!(typeof c === 'string') && c.type!=='BR' && c?.content[0] !=='[To Parent Directory]')
    })
    return contentArray;
}

