import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function Repo() {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await fetch(`http://localhost:8000/repo/${id}`);
        const data = await response.json();
        console.log('Fetched data:', data); // Log the entire data object
        setRepo(data);
        
        console.log('Files:', data.files); // Log the files object specifically
        
        // Check if files is an object before trying to use Object.values
        
            // Fetch the content of the .txt file
            console.log('txtFile url:', data.files[0].filename); // Log the txtFile object
            const contentResponse = await fetch(`../../uploads/${data.files[0].filename}`);
            const content = await contentResponse.text();
            setFileContent(content);
            console.log('File content:', content);
         
       
      } catch (err) {
        console.log("Error while fetching repo: ", err);
      }
    }
    fetchRepo();
  }, [id])

  const highlightSyntax = (code) => {
    // This is a simple syntax highlighting function
    // You may want to expand this for more accurate highlighting
    return code
      .replace(/\b(const|let|var|function|return|if|else|for|while)\b/g, '<span>$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="builtin">$1</span>')
      .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>')
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
      .replace(/(\{|\}|$$|$$|\[|\])/g, '<span class="bracket">$1</span>')
      .replace(/(\w+)(?=\s*\()/g, '<span class="function">$1</span>');
  };

  return (
    <div className="github-like-viewer">
      {repo ? (
        <div>
          <h1 className="repo-name">{repo.name}</h1>
          <p className="repo-description">{repo.description}</p>
          {fileContent && (
            <div className="file-content">
              <div className="file-header">
                <span className="file-name">{repo.files[0].filename}</span>
                <button className="copy-button" onClick={() => navigator.clipboard.writeText(fileContent)}>
                  Copy
                </button>
              </div>
              <pre className="code-block">
                <code>
                  {fileContent.split('\n').map((line, index) => (
                    <div key={index} className="code-line">
                      <span className="line-number">{index + 1}</span>
                      <span className="line-content" dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }}></span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          )}
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
      <style jsx>{`
        .github-like-viewer {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          color: #24292f;
        }
        .repo-name {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .repo-description {
          font-size: 14px;
          color: #57606a;
          margin-bottom: 16px;
        }
        .file-content {
          border: 1px solid #d0d7de;
          border-radius: 6px;
          overflow: hidden;
        }
        .file-header {
          background-color: #f6f8fa;
          padding: 8px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #d0d7de;
        }
        .file-name {
          font-weight: 600;
          font-size: 14px;
        }
        .copy-button {
          background-color: #f6f8fa;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }
        .copy-button:hover {
          background-color: #f3f4f6;
        }
        .code-block {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
          font-size: 12px;
          line-height: 20px;
          background-color: #f6f8fa;
        }
        .code-line {
          display: flex;
        }
        .line-number {
          color: #6e7781;
          text-align: right;
          width: 40px;
          padding-right: 16px;
          user-select: none;
        }
        .line-content {
          white-space: pre;
        }
        .loading {
          font-size: 16px;
          color: #57606a;
        }
        /* Syntax highlighting styles */
        .keyword {
          color: #cf222e;
        }
        .builtin {
          color: #0550ae;
        }
        .string {
          color: #0a3069;
        }
        .number {
          color: #0550ae;
        }
        .bracket {
          color: #24292f;
        }
        .function {
          color: #8250df;
        }
      `}</style>
    </div>
  )
}

export default Repo