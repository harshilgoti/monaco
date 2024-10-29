// "use client";

// import Editor from "@monaco-editor/react";
// import { useEffect, useState } from "react";

// const SqlEditor = (errorMarker = {}) => {
//   const [editor, setEditor] = useState(null);
//   const [monaco, setMonaco] = useState(null);
//   const [value, setValue] = useState(null);

//   const handleEditorDidMount = (editorInstance, monacoInstance) => {
//     setEditor(editorInstance);
//     setMonaco(monacoInstance);

//     monacoInstance.languages.register({ id: "extended-mysql" });

//     const mysqlTokenizer = monacoInstance.languages
//       .getLanguages()
//       .find((lang) => lang.id === "mysql");

//     if (mysqlTokenizer && mysqlTokenizer.loader) {
//       mysqlTokenizer.loader().then((mysqlLangConfig) => {
//         const extendedTokenizer = {
//           ...mysqlLangConfig,
//           language: {
//             ...mysqlLangConfig.language,
//             tokenizer: {
//               ...mysqlLangConfig.language.tokenizer,
//               root: [
//                 [/\$[a-zA-Z0-9_]+/, "variable.special"],
//                 ...mysqlLangConfig.language.tokenizer.root,
//               ],
//             },
//           },
//         };
//         console.log("extendedTokenizer", extendedTokenizer);
//         console.log(
//           "monacoInstance.editor",
//           monacoInstance.editor.getEditors()
//         );
//         monacoInstance.languages.setMonarchTokensProvider("extended-mysql", {
//           tokenizer: extendedTokenizer,
//         });

//         monacoInstance.editor.defineTheme("mysql-with-custom-vars", {
//           base: "vs-dark",
//           inherit: true,
//           rules: [
//             {
//               token: "variable.special",
//               foreground: "FFA500",
//               fontStyle: "bold",
//             },
//           ],

//           colors: {
//             "editor.background": "#1E1E1E",
//             // "editor.width": "100%", // Ensure the background is dark
//           },
//         });

//         monacoInstance.editor.setTheme("mysql-with-custom-vars");
//       });
//     }
//   };

//   const addErrorMarker = () => {
//     if (!editor || !monaco || !errorMarker || !errorMarker.message) return;
//     const model = editor.getModel();

//     if (model) {
//       const {
//         line = 1,
//         column = 1,
//         message = "An error occurred",
//       } = errorMarker;
//       monaco.editor.setModelMarkers(model, "owner", [
//         {
//           startLineNumber: line,
//           startColumn: column,
//           endLineNumber: line,
//           endColumn: column + 5,
//           message,
//           severity: monaco.MarkerSeverity.Error,
//         },
//       ]);
//     }
//   };

//   const clearMarkers = () => {
//     if (editor && monaco) {
//       const model = editor.getModel();
//       if (model) monaco.editor.setModelMarkers(model, "owner", []);
//     }
//   };

//   useEffect(() => {
//     if (editor && monaco) {
//       clearMarkers();
//       addErrorMarker();
//     }
//   }, [editor, monaco, errorMarker]);

//   return (
//     <div style={{ height: "100%", backgroundColor: "#1E1E1E" }}>
//       <Editor
//         defaultLanguage="extended-mysql"
//         language="extended-mysql"
//         defaultValue={`SELECT * FROM users WHERE date = $test_date AND name = $username;`}
//         theme="mysql-with-custom-vars"
//         height="70%"
//         width="100%"
//         className="rounded-sm border text-primary-text"
//         options={{
//           minimap: { enabled: false },
//           quickSuggestions: true,
//           quickSuggestionsDelay: 100,
//           scrollBeyondLastLine: false, // Avoid extra whitespace at the bottom
//           automaticLayout: true, // Ensure layout responsiveness
//         }}
//         onChange={(value) => {
//           setValue(value || "");
//           clearMarkers();
//         }}
//         value={value}
//         onMount={handleEditorDidMount}
//       />
//     </div>
//   );
// };

// export default SqlEditor;

import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

const SqlEditor = ({ language = "mysql", errorMarker = {} }) => {
  const [editor, setEditor] = useState(null);
  const [monaco, setMonaco] = useState(null);
  const [value, setValue] = useState(null);

  const handleEditorDidMount = (editorInstance, monacoInstance) => {
    setEditor(editorInstance);
    setMonaco(monacoInstance);

    // Define a custom theme with variable highlighting
    monacoInstance.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        {
          token: "variable.special", // Custom token for variables
          foreground: "FFA500", // Orange color
        },
      ],
      colors: {},
    });

    // Register a custom SQL language that extends MySQL
    monacoInstance.languages.register({ id: "mysql-custom" });

    monacoInstance.languages.setMonarchTokensProvider("mysql-custom", {
      tokenizer: {
        root: [
          // Custom rule: Match variables like $test_date-from
          [/\$\w+(-\w+)*/, "variable.special"],
        ],
      },
    });

    // Apply the custom theme
    monacoInstance.editor.setTheme("customTheme");
  };

  const addErrorMarker = () => {
    if (!editor || !monaco || !errorMarker || !errorMarker.message) return;
    const model = editor.getModel();

    if (model) {
      const errorLine = errorMarker?.line || 1;
      const errorColumn = errorMarker?.column || 1;
      monaco.editor.setModelMarkers(model, "owner", [
        {
          startLineNumber: errorLine,
          startColumn: errorColumn,
          endLineNumber: errorLine,
          endColumn: errorColumn + 5,
          message: errorMarker.message || "An error occurred",
          severity: monaco.MarkerSeverity.Error,
        },
      ]);
    }
  };

  const clearMarkers = () => {
    if (editor && monaco) {
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelMarkers(model, "owner", []);
      }
    }
  };

  useEffect(() => {
    if (editor && monaco) {
      clearMarkers();
      addErrorMarker();
    }
  }, [editor, monaco, errorMarker]);

  return (
    <Editor
      defaultLanguage={language === "mysql" ? "mysql-custom" : language}
      language={language}
      defaultValue={`SELECT * FROM users WHERE date = $test_date-from;`}
      theme="customTheme"
      className="rounded-sm border text-primary-text"
      height={"70%"}
      options={{
        minimap: { enabled: false },
        quickSuggestions: true,
        quickSuggestionsDelay: 100,
      }}
      onChange={(value) => {
        setValue(value || "");
        clearMarkers();
      }}
      value={value}
      onMount={handleEditorDidMount}
    />
  );
};

export default SqlEditor;
