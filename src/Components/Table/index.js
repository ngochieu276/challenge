import React, { useState } from "react";
import { Fragment } from "react/cjs/react.production.min";
import { Button } from "react-bootstrap";
import { FiChevronDown, FiChevronUp, FiMoreVertical } from "react-icons/fi";
import styled from "styled-components";
import "./style.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

/**
 * @author
 * @function Table
 **/
const initHeaders = [
  {
    Header: "SourceId",
    isSorted: false,
    visible: true,
    showControl: false,
    value: "sourceId",
  },
  {
    Header: "Title",
    isSorted: false,
    visible: true,
    showControl: false,
    value: "title",
  },
  {
    Header: "Region",
    isSorted: false,
    visible: true,
    showControl: false,
    value: "region",
  },
  {
    Header: "Rank",
    isSorted: false,
    visible: true,
    showControl: false,
    value: "rank",
  },
  {
    Header: "CitableDocsThreeYear",
    isSorted: false,
    visible: true,
    showControl: false,
    value: "citableDocsThreeYear",
  },
];

const Table = ({ data, getSort, getFilter }) => {
  const [headers, setHeaders] = useState(initHeaders);
  const [dragOver, setDragOver] = useState("");
  const [operator, setOperator] = useState("");
  const [query, setQuery] = useState("");

  // control header

  const toogleShowControl = (headerValue) => {
    const newHeaders = [...headers];
    newHeaders.map((header) => {
      if (header.value === headerValue) {
        header.showControl = !header.showControl;
      }
    });
    setHeaders(newHeaders);
  };

  //  sort
  const sortHandle = (field, condition) => {
    getSort(field, condition);
  };

  // filter

  const filterHandle = (header) => {
    getFilter(operator, query, header);
    setQuery("");
  };

  // reorder
  const handleDragStart = (e) => {
    const { id } = e.target;
    const idx = headers.map((head) => head.Header).indexOf(id);
    e.dataTransfer.setData("colIdx", idx);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = (e) => {
    const { id } = e.target;
    setDragOver(id);
  };

  const handleOnDrop = (e) => {
    const { id } = e.target;
    const droppedColIdx = headers.map((head) => head.Header).indexOf(id);
    const draggedColIdx = e.dataTransfer.getData("colIdx");
    const tempHeaders = [...headers];

    tempHeaders[draggedColIdx] = headers[droppedColIdx];
    tempHeaders[droppedColIdx] = headers[draggedColIdx];
    setHeaders(tempHeaders);
    setDragOver("");
  };

  const checkBox = (
    <div className='checkBox'>
      {headers.map((header, i) => {
        return (
          <div>
            <input
              type='checkbox'
              id={header.value}
              name={header.Header}
              value={header.value}
              checked={header.visible ? true : false}
              onChange={(e) => {
                let newHeaders = [...headers];
                newHeaders[i].visible = !header.visible;
                setHeaders(newHeaders);
              }}
            />
            <label for={header.value}>{header.Header}</label>
          </div>
        );
      })}
    </div>
  );
  return (
    <div className='table-container'>
      <div className='popup'>
        <Popup
          trigger={<button> Column control</button>}
          position='right center'
        >
          {checkBox}
        </Popup>
      </div>
      <table>
        <thead>
          <tr>
            {headers.map((header) => {
              if (header.visible) {
                return (
                  <StyledTh
                    className='StyledTh'
                    id={header.Header}
                    key={header.Header}
                    draggable
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleOnDrop}
                    onDragEnter={handleDragEnter}
                    dragOver={header.Header === dragOver}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {header.Header}
                      <FiMoreVertical
                        className='icon'
                        onClick={() => {
                          toogleShowControl(header.value);
                        }}
                      />
                    </div>
                    {header.showControl && (
                      <div className='controls'>
                        <div className='sort-control'>
                          <FiChevronUp
                            className='icon'
                            onClick={() => {
                              sortHandle(header.value, "asc");
                            }}
                          />
                          <FiChevronDown
                            className='icon'
                            onClick={() => {
                              sortHandle(header.value, "desc");
                            }}
                          />
                        </div>
                        <form className='filter-control'>
                          <div>
                            <label for='operator'>Operator</label>
                            <br></br>
                            <select
                              name='operator'
                              id='operator'
                              value={operator}
                              onChange={(e) => {
                                setOperator(e.target.value);
                              }}
                            >
                              <option value=''>Choose operator</option>
                              <option value='contains'>Contains</option>
                              <option value='equals'>Equals</option>
                              <option value='start-with'>Start with</option>
                              <option value='end-with'>End with</option>
                              <option value='empty'>Empty</option>
                              <option value='is-not-empty'>Is not empty</option>
                            </select>
                          </div>
                          <div>
                            <label for='value'>Value</label>
                            <br></br>
                            <input
                              type='text'
                              value={query}
                              onChange={(e) => {
                                setQuery(e.target.value);
                              }}
                              id='operator'
                              placeholder='Search by'
                            />
                          </div>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              filterHandle(header.value);
                            }}
                          >
                            Search
                          </Button>
                        </form>
                      </div>
                    )}
                  </StyledTh>
                );
              } else {
                return null;
              }
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            return (
              <tr key={row.sourceId}>
                {Object.entries(row).map(([r, v], idx) => {
                  if (headers[idx].visible) {
                    return (
                      <Cell key={v} dragOver={headers[idx].Header === dragOver}>
                        {row[headers[idx].value]}
                      </Cell>
                    );
                  } else {
                    return null;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Cell = styled.td`
  font-size: 14px;
  text-align: left;
  text-transform: capitalize;
  vertical-align: center;
  padding: 20px;
  border-bottom: 2px solid #eef0f5;
  border-left: ${({ dragOver }) => dragOver && "5px solid red"};
`;

const StyledTh = styled.th`
  white-space: nowrap;
  color: #fff;
  letter-spacing: 1.5px;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  text-transform: capitalize;
  vertical-align: middle;
  padding: 20px;
  border-bottom: 2px solid #eef0f5;
  text-transform: uppercase;
  border-left: ${({ dragOver }) => dragOver && "5px solid red"};
`;

export default Table;
