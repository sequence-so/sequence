import React, {
  Ref,
  PropsWithChildren,
  useCallback,
  useState,
  CSSProperties,
  useRef,
  useEffect,
} from "react";
import {
  BaseEditor,
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  Text,
} from "slate";
import { Editable, withReact, useSlate, Slate, ReactEditor } from "slate-react";
import { jsx } from "slate-hyperscript";
import { HistoryEditor, withHistory } from "slate-history";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import escapeHtml from "escape-html";
import styles from "styles/Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faSubscript } from "@fortawesome/free-solid-svg-icons";
import { Fade, makeStyles, MenuItem } from "@material-ui/core";
import { PRODUCT_USER_COLUMN_MAPPING } from "components/productUser/columnMapping";
import MaterialMenu from "@material-ui/core/Menu";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

type CustomText = {
  text: string;
  h1?: boolean;
  h2?: boolean;
  underline?: boolean;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: { type: "paragraph" | "block-quote"; children: CustomText[] };
    Text: CustomText;
  }
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
type OrNull<T> = T | null;

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <>
      <span {...props} ref={ref} />
      <style jsx>{`
        span {
          cursor: pointer;
          color: ${reversed
            ? active
              ? "white"
              : "#55585C"
            : active
            ? "#55585C"
            : "#ccc"} !important;
        }
      `}</style>
    </>
  )
);

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      className={classNames("material-icons", styles.editor_icon, className)}
      style={{ color: "inherit" }}
    />
  )
);

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <>
      <div
        {...props}
        ref={ref}
        className={styles.editor_menu + " " + className}
      />
    </>
  )
);

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <Menu
      {...props}
      ref={ref}
      className={classNames(className, styles.editor_toolbar)}
    />
  )
);

interface Props {
  value: string;
  onChange: (html: string) => void;
  onChangeModes: () => void;
}

const slateDeserialize = (el: HTMLElement) => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  }

  let children = Array.from(el.childNodes).map(slateDeserialize);

  if (children.length === 0) {
    children = [{ text: "" }];
  }

  switch (el.nodeName) {
    case "BODY":
      return jsx("fragment", {}, children);
    case "BR":
      return "\n";
    case "BLOCKQUOTE":
      return jsx("element", { type: "quote" }, children);
    case "P":
      return jsx("element", { type: "paragraph" }, children);
    case "A":
      return jsx(
        "element",
        { type: "link", url: el.getAttribute("href") },
        children
      );
    case "STRONG":
    case "SPAN":
      const type: any = {};
      if (el.style.textDecoration === "underline") {
        type.underline = true;
      }
      if (el.style.fontWeight === "500") {
        type.bold = true;
      }
      if (el.style.fontStyle === "italic") {
        type.italic = true;
      }
      return { type: "element", text: el.textContent, ...type };
    default:
      return el.textContent;
  }
};

const deserializeHtml = (value: string) => {
  if (value === "") {
    return [{ type: "paragraph", children: [{ text: "" }] }];
  }
  let cleaned = value.replace(/\n/g, "");
  const doc = new DOMParser().parseFromString(cleaned, "text/html");
  return slateDeserialize(doc.body);
};

const EMPTY = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const RichTextExample = (props: Props) => {
  const initialValue = props.value ? deserializeHtml(props.value) : EMPTY;
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editorRef = useRef<BaseEditor & ReactEditor & HistoryEditor>();
  if (!editorRef.current) {
    editorRef.current = withReact(createEditor());
  }
  const editor = editorRef.current;
  const [showVariables, setShowVariables] = useState(false);

  const onChange = useCallback((value) => {
    if (value) {
      setValue(value);
      props.onChange(serialize({ children: value }));
    }
  }, []);

  useEffect(() => {
    setValue(deserializeHtml(props.value));
  }, [props.value]);

  const [anchorEl, setAnchorEl] = useState(null);
  const toggleVariables = useCallback(() => {
    setShowVariables(!showVariables);
  }, [showVariables]);
  const onClickVariableMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const onSelectVariable = useCallback(
    (elem) => {
      editorRef.current.insertText(`{{${elem.field}}}`);
      setAnchorEl(null);
    },
    [editorRef.current]
  );
  const onChangeModes = useCallback(() => {
    props.onChangeModes();
  }, []);

  return (
    <div>
      <Slate editor={editor} value={value} onChange={onChange}>
        <Toolbar>
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          <VariableButton onClick={onClickVariableMenu} />
          <SwitchModesButton onClick={onChangeModes} />
        </Toolbar>
        <div
          style={{
            display: "flex",
            border: "1px solid #B6B6B8",
            borderRadius: 4,
            paddingLeft: "14px",
            paddingRight: "4px",
            paddingTop: "8px",
            minHeight: 350,
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter some text..."
            spellCheck
            autoFocus
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
            style={{ width: "100%", minHeight: "100%" }}
          />
        </div>
      </Slate>
      <VariablesMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        onClickVariable={onSelectVariable}
      />
    </div>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const result = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  const node = result.next();
  return node && !!node.value;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  let styleAttributes: CSSProperties = {};
  let elemType: string;
  if (leaf.bold) {
    elemType = "span";
    styleAttributes.fontWeight = 500;
  }

  if (leaf.code) {
    elemType = "code";
  }

  if (leaf.italic) {
    elemType = "span";
    styleAttributes.fontStyle = "italic";
  }

  if (leaf.underline) {
    elemType = "span";
    styleAttributes.textDecoration = "underline";
  }

  return (
    <span {...attributes} style={styleAttributes}>
      {children}
    </span>
  );
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export const VariableButton = React.forwardRef(
  (props: { onClick: (event: any) => void }, ref) => {
    return (
      <Button
        {...props}
        active={true}
        onMouseDown={(event) => {
          event.preventDefault();
          props.onClick(event);
        }}
        ref={ref as any}
      >
        <Icon className="smaller_icon">
          <FontAwesomeIcon
            style={{ verticalAlign: 2, marginLeft: 3 }}
            width={16}
            fontSize={20}
            icon={faSubscript}
          ></FontAwesomeIcon>
        </Icon>
        {/* <style jsx>{`
          .smaller {
            font-size: 18px !important;
          }
        `}</style> */}
      </Button>
    );
  }
);

export const SwitchModesButton = React.forwardRef(
  (props: { onClick: (event: any) => void }, ref) => {
    return (
      <Button
        {...props}
        active={true}
        onMouseDown={(event) => {
          event.preventDefault();
          props.onClick(event);
        }}
        ref={ref as any}
      >
        <Icon className="smaller_icon">
          <FontAwesomeIcon
            style={{ verticalAlign: 2, marginLeft: 3 }}
            width={12}
            fontSize={12}
            icon={faCode}
          ></FontAwesomeIcon>
        </Icon>
        <style jsx>{`
          .smaller {
            font-size: 18px;
          }
        `}</style>
      </Button>
    );
  }
);

const serialize = (node) => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    let cssStyle: any = {};
    if (node.bold) {
      cssStyle["font-weight"] = 500;
    }
    if (node.underline) {
      cssStyle["text-decoration"] = "underline";
    }
    if (node.italic) {
      cssStyle["font-style"] = "italic";
    }
    if (Object.keys(cssStyle).length === 0) {
      return string;
    }
    const styleString = Object.keys(cssStyle)
      .map((key) => `${key}: ${cssStyle[key]}`)
      .join(";");
    return `<span style="${styleString}">${string}</span>`;
  }

  const children = node.children?.map((n) => serialize(n)).join("");

  switch (node.type) {
    case "quote":
      return `<blockquote><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "link":
      return `<a href="${escapeHtml(node.url)}">${children}</a>`;
    default:
      return children;
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "IBM Plex Sans",
    color: "#4E4F55",
  },
  menu: {
    "& .MuiList-root": {
      paddingTop: 0,
      width: 200,
      height: 430,
      overflowY: "scroll",
    },
    "& .MuiMenuItem-root": {
      fontFamily: "IBM Plex Sans",
      color: "#4E4F55",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export const VariablesMenu = ({
  anchorEl,
  setAnchorEl,
  onClickVariable,
}: {
  anchorEl: any;
  setAnchorEl: any;
  onClickVariable: (value: string) => void;
}) => {
  const classes = useStyles();
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickVariable = (elem: any) => () => {
    onClickVariable(elem);
  };

  return (
    <MaterialMenu
      id="fade-menu"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
      className={classes.menu}
      anchorOrigin={{
        vertical: 26,
        horizontal: 0,
      }}
      getContentAnchorEl={null}
      transformOrigin={{
        vertical: 0,
        horizontal: 0,
      }}
    >
      {PRODUCT_USER_COLUMN_MAPPING.map((el) => (
        <MenuItem
          key={el.field}
          onClick={handleClickVariable(el)}
          style={{ paddingTop: 5, paddingBottom: 5 }}
        >
          <span style={{ marginLeft: 8 }}>{el.headerName}</span>
        </MenuItem>
      ))}
    </MaterialMenu>
  );
};
export default RichTextExample;
