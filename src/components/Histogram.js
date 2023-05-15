import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
function Histogram({ link }) {
  const [content, setContent] = useState("");
  const [wordCounts, setWordCounts] = useState([]);
  const [showHisto, setShowHisto] = useState(false);

  const handleClick = () => {
    setShowHisto(!showHisto);
  };
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(link);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, [link]);

  useEffect(() => {
    const countWords = () => {
      const words = content.toLowerCase().split(/\W+/);
      const counts = {};

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        counts[word] = counts[word] ? counts[word] + 1 : 1;
      }

      const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      setWordCounts(sortedCounts);
    };

    countWords();
  }, [content]);

  const topWords = wordCounts.slice(0, 20).map(([word, count]) => ({
    word,
    count,
  }));
  const chartData = topWords.map(({ word, count }) => ({ word, count }));

  const csvData = [
    ["Word", "Count"],
    ...chartData.map(({ word, count }) => [word, count]),
  ];

  const handleClick3 = () => {
    setShowHisto(!showHisto);
  };

  return (
    <>
      <div>
        {showHisto && (
          <center>
            <h1 style={{ marginTop: "2%" }}>Histogram</h1>
            <BarChart width={1500} height={400} data={topWords}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="word" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
            <div style={{ marginTop: "5%" }}>
              <button class="btn btn-warning btn-lg" onClick={handleClick3}>
                Go Back
              </button>
              <CSVLink data={csvData} filename="histogram_data.csv">
                <button
                  style={{ marginLeft: "20px" }}
                  class="btn btn-success btn-lg"
                >
                  Export
                </button>
              </CSVLink>
            </div>
          </center>
        )}
      </div>
      {!showHisto && (
        <center>
          <h1 style={{ marginTop: "5%" }}>
            Click The Button Below To Show Histogram!
          </h1>
          <button
            style={{ marginTop: "5%" }}
            class="btn btn-primary btn-lg"
            onClick={handleClick}
          >
            Show Histogram
          </button>
        </center>
      )}
    </>
  );
}

export default Histogram;
