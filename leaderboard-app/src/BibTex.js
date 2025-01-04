import { LuCopy } from "react-icons/lu";
import "./BibTex.css";

// BibTeX entry for the paper
const BIBTEX_ENTRY = `@article{TODO:,
  title={TODO:},
  author={TODO:},
  journal={TODO:},
  year={2025}
}`;

const copyClipboard = () => {
  navigator.clipboard.writeText(BIBTEX_ENTRY).catch((error) => {
    console.error("Failed to copy BibTeX entry to clipboard", error);
  });
};

const BibTeX = () => {
  return (
    <div className="bibtex">
      <h1 className="bibtex-title">BibTeX</h1>
      <pre className="bibtex-entry">
        <code>{BIBTEX_ENTRY}</code>
        <button className="bibtex-copy-button" onClick={copyClipboard}>
          <LuCopy />
        </button>
      </pre>
    </div>
  );
};

export default BibTeX;
