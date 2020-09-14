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
