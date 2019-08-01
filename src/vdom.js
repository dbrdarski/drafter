import { mountComponent } from './component';
import { connect, dispatch } from './dispatch';

export const createElement = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
};

export const createDOMElement = (vNode) => {
  const { tagName, attrs, children } = vNode;
  const $el = document.createElement(tagName);
  for (const [k, v] of Object.entries(attrs)) {
    $el.setAttribute(k, v);
  }
  for (const child of children) {
    const $child = createDOM(child);
    $el.appendChild($child)
  }
  vNode.instance = $el;
  return $el;
};

const createComponent = (vNode) => {
  const { tagName, attrs, children } = vNode;
  const componentInstance = mountComponent(tagName, attrs, children);
  vNode.instance = componentInstance;
  // let i = componentInstance.render();
  // console.log({ i })
  return createDOM(componentInstance.render());
};

export const mountNode = ($node, $target) => {
  $target.replaceWith($node);
  return $node;
};

export const createDOM = (vNode)  => {
  // console.log({ vNode })
  if(vNode == null) {
    return vNode;
  }
  switch (typeof vNode) {
    case 'boolean':
      return void 0;
      break;
    case 'number':
    case 'string': {
      return document.createTextNode(vNode);
      break;
    }
    case 'object': {
      const nodeType = typeof vNode.tagName;
      if (nodeType === 'string') {
        return createDOMElement(vNode);
      } else if (nodeType === 'function') {
        return createComponent(vNode);
      }
      break;
    }
    default:
  }
}

const isTextNode = (v) => {
  const type = typeof v;
  return type === 'string' || type === 'number';
}

const isNotNode = (v) => {
  return v == null || typeof v === 'boolean';
}

const diffAttrs = (oldAttrs, newAttrs) => {
  const patches = [];
  // console.log({ oldAttrs, newAttrs })

  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push($node => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  for (const [k, v] of Object.entries(oldAttrs)) {
    if(!(k in newAttrs)){
      patches.push($node => {
        node.removeAttribut(k);
        return $node;
      })
    }
  }
  return $node => {
    for (const patch of patches) {
      patch($node);
    }
  };
};


const zip = (xs, ys) => {
  const zipped = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
};

const diffChildren = (oldChildren, newChildren) => {
  const patches = [];
  for (const [ oldChild, newChild ] of zip(oldChildren, newChildren)) {
    patches.push(diff(oldChild, newChild));
  }

  const additionalPatches = [];
  for (const additionalChild of newChildren.slice(oldChildren.length)) {
    additionalPatches.push($node => {
      $node.appendChild(createDOM(additionalChild));
    });
    return $node;
  }

  return parent => {
    for (const [ patch, child ] of zip(patches, parent.childNodes)){
      patch(child);
      return parent;
    }
  }
};

export const diff = (vOldNode, vNewNode, context) => {
  // console.log({ vOldNode, vNewNode })
  if (isNotNode(vNewNode)){
    return $node => {
      $node.remove();
      return void 0;
    }
  }

  if (isNotNode(vOldNode)){
    return $node => {
      return createDOM(vNewNode);
    }
  }

  if(isTextNode(vOldNode) || isTextNode(vNewNode)) {
    if (vOldNode !== vNewNode) {
      return $node => {
        const $newNode = createDOM(vNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return $node => void 0;
    }
  }

  if (vOldNode.tagName !== vNewNode.tagName) {
    return $node => {
      const $newNode = createDOM(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
  const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

  return $node => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  }
}

export const mount = (component, $el) => {
  let vApp;
  // let $app = createDOM(component);
  let $rootEl;
  const handler = window.handler = () => {
    // console.log('TICK!!!!')
    const vNewApp = createDOM(component);
    const patch = diff(vApp, component);
    $rootEl = patch($rootEl);
    mountNode($rootEl, $el);
    $el = $rootEl;
    vApp = vNewApp;
  };
  handler();
  connect(handler);
  // dispatch();

  // console.log({ $rootEl, $el });
}

// const vNewApp = createVApp(count);
// const patch = diff(vApp, vNewApp);
// $rootEl = patch($rootEl);
// vApp = vNewApp;
