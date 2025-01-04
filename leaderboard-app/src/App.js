import React, { useEffect, useState } from 'react';
import { FaGithub, FaRegFilePdf, FaTwitter } from "react-icons/fa";
import './App.css';
import LinkButton from './LinkButton';

function App() {
    const [data, setData] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [sortConfig, setSortConfig] = useState(null);

    useEffect(() => {
        // JSONデータをフェッチ
        fetch('/leaderboard.json')
            .then((response) => response.json())
            .then((data) => {
                setData(data);

                // データセットとメトリックを動的に取得
                const datasetNames = data.reduce((acc, row) => {
                    return acc.concat(Object.keys(row.scores));
                }, []).filter((value, index, self) => {
                    return self.indexOf(value) === index;
                });
                setDatasets(datasetNames);

                const metricNames = {};
                datasetNames.forEach((dataset) => {
                    const metricNamesArray = data.reduce((acc, row) => {
                        return acc.concat(Object.keys(row.scores[dataset] || {}));
                    }, []).filter((value, index, self) => {
                        return self.indexOf(value) === index;
                    });
                    metricNames[dataset] = metricNamesArray;
                });

                setMetrics(metricNames);
            })
            .catch((error) => console.error('Error loading data:', error));
    }, []);

    // ソート機能
    const handleSort = (dataset, metric) => {
        let sortedData = [...data];
        const direction = sortConfig?.key === `${dataset}-${metric}` && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        sortedData.sort((a, b) => {
            const aValue = a.scores[dataset]?.[metric] || 0;
            const bValue = b.scores[dataset]?.[metric] || 0;
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortConfig({ key: `${dataset}-${metric}`, direction });
        setData(sortedData);
    };

    // Get sorting direction arrow
    const getSortArrow = (dataset, metric) => {
        if (sortConfig?.key === `${dataset}-${metric}`) {
            return sortConfig.direction === 'asc' ? '↑' : '↓';
        }
        return '↕';  // Default arrow for unsorted columns
    };
  const LINK_BUTTONS = [
  {
    url: "https://github.com/llm-jp/llm-jp-eval-mm",
    children: (
      <>
        <FaRegFilePdf />
        &nbsp;Paper (arXiv)
      </>
    ),
  },
  {
    url: "https://github.com/llm-jp/llm-jp-eval-mm",
    children: (
      <>
        <FaGithub />
        &nbsp;Code
      </>
    ),
  },
];

    return (
        <div className="App">
            <header>
          <h1>llm-jp-eval-mm Leaderboard</h1>
          {/* paper, code link button */}
         <div className="link-buttons">
          {LINK_BUTTONS.map((linkButton, index) => (
            <LinkButton key={`linkButton${index}`} url={linkButton.url}>
              {linkButton.children}
            </LinkButton>
          ))}
          </div>


            </header>
            <table>
                <thead>
                    <tr>
                        <th>Model</th>
                        {datasets.map((dataset) => (
                            <th key={dataset} colSpan={metrics[dataset]?.length || 0}>
                                {dataset}
                            </th>
                        ))}
                    </tr>
                    <tr>
                        <th></th>
                        {datasets.map((dataset) =>
                            metrics[dataset]?.map((metric) => (
                                <th
                                    key={`${dataset}-${metric}`}
                                    onClick={() => handleSort(dataset, metric)}
                                >
                                    {metric} {getSortArrow(dataset, metric)}
                                </th>
                            ))
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td><a href={item.url}>{item.model}</a></td>
                            {datasets.map((dataset) =>
                                metrics[dataset]?.map((metric) => (
                                    <td key={`${dataset}-${metric}`}>
                                        {item.scores[dataset]?.[metric] || '-'}
                                    </td>
                                ))
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
