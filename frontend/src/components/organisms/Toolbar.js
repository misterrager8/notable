import { useContext, useState } from "react";
import { MultiContext } from "../../App";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";
import Dropdown from "../molecules/Dropdown";
import Input from "../atoms/Input";
import { api } from "../../util";

export default function Toolbar({ selection, className }) {
  const multiCtx = useContext(MultiContext);

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDate = () => {
    let now = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    return now;
  };

  const formats = [
    {
      icon: "type-bold",
      label: "bold",
      format: `**${selection.selected}**`,
    },
    {
      icon: "type-italic",
      label: "italic",
      format: `*${selection.selected}*`,
    },
    {
      icon: "type-h1",
      label: "heading",
      format: `### ${selection.selected}`,
    },
    {
      icon: "hr",
      label: "hrule",
      format: "\n---\n",
    },
    {
      icon: "sort-down-alt",
      label: "sort",
      format: `${selection.selected.split("\n").toSorted().join("\n")}`,
    },
    {
      icon: "sort-down",
      label: "sort-reverse",
      format: `${selection.selected
        .split("\n")
        .toSorted()
        .reverse()
        .join("\n")}`,
    },
    {
      icon: "list-ul",
      label: "bullet-list",
      format: `- ${selection.selected.split("\n").join("\n- ")}`,
    },
    {
      icon: "check-lg",
      label: "check",
      format: `✓`,
    },
    {
      icon: "code-slash",
      label: "code",
      format: `\`\`\`${selection.selected}\`\`\``,
    },
    {
      icon: "code",
      label: "code-inline",
      format: `\`${selection.selected}\``,
    },
    {
      icon: "image",
      label: "image",
      format: `![${selection.selected}]()`,
    },
    {
      icon: "link",
      label: "link",
      format: `[](${selection.selected})`,
    },
    {
      icon: "type",
      label: "capitalize",
      format: `${
        selection.selected.charAt(0).toUpperCase() + selection.selected.slice(1)
      }`,
    },
    {
      icon: "alphabet-uppercase",
      label: "allcaps",
      format: `${selection.selected.toUpperCase()}`,
    },
    {
      icon: "alphabet",
      label: "alllower",
      format: `${selection.selected.toLowerCase()}`,
    },
    {
      icon: "indent",
      label: "indent",
      format: `  ${selection.selected}`,
    },
    {
      text: "( )",
      label: "parentheses",
      format: `(${selection.selected})`,
    },
    {
      text: "{ }",
      label: "curly-braces",
      format: `{${selection.selected}}`,
    },
    {
      text: "[ ]",
      label: "square-brackets",
      format: `[${selection.selected}]`,
    },
    {
      text: "' '",
      label: "single-quotes",
      format: `'${selection.selected}'`,
    },
    {
      text: '" "',
      label: "double-quotes",
      format: `"${selection.selected}"`,
    },
    {
      icon: "calendar",
      label: "date-1",
      format: `${new Date().getDate()} ${monthNames[new Date().getMonth()]}`,
    },
    {
      icon: "clock",
      label: "date-3",
      format: formatDate(),
    },
    {
      icon: "highlighter",
      label: "highlighter",
      format: `<mark>${selection.selected}</mark>`,
    },
    {
      icon: "superscript",
      label: "superscript",
      format: `<sup>${selection.selected}</sup>`,
    },
    {
      icon: "type-strikethrough",
      label: "type-strikethrough",
      format: `~~${selection.selected}~~`,
    },
  ];

  const copyFormat = (format) => {
    let format_ = formats.filter((x) => x.label === format)[0];
    let new_ =
      multiCtx.content.substring(0, selection.start) +
      format_.format +
      multiCtx.content.substring(selection.end, multiCtx.content.length);
    multiCtx.setContent(new_);
  };

  return (
    <div className={className} id="toolbar">
      <ButtonGroup className="toolbar">
        {formats.map((x) => (
          <Button
            icon={x.icon}
            text={x.text}
            onClick={() => copyFormat(x.label)}
          />
        ))}
      </ButtonGroup>
    </div>
  );
}
