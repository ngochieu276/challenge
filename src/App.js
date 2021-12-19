import "./App.css";
import React, { useEffect, useState } from "react";
import columns from "./Components/Table/column";
import axios from "axios";
import Spinner from "./Components/UI/Spinner";
import Table from "./Components/Table/index";
import Pagination from "./Components/Pagination/index";

function App() {
  const pageNumber = 1;
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(pageNumber);
  const [pages, setPages] = useState(1);

  const fetchData = async () => {
    const res = await axios.post(
      `http://o-research-dev.orlab.com.vn/api/v1/filters/filter/?modelType=journals&filter=%7B%7D&page=${page}&pageSize=20&isPaginateDB=true&ignoreAssociation=true`
    );
    if (res.status === 200) {
      const totalItem = res.data.metaData.total;
      const totalPage = Math.floor(totalItem / 20);
      const dataResponse = res.data.data;
      const essentialData = dataResponse.map((data) => {
        const picked = (({
          sourceId,
          title,
          region,
          rank,
          citableDocsThreeYear,
        }) => ({
          sourceId,
          title,
          region,
          rank,
          citableDocsThreeYear,
        }))(data);
        return picked;
      });
      setData(essentialData);
      setPages(totalPage);
      setInitData(essentialData);
      setLoading(false);
    } else {
      console.log(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  /////////// SORT //////////////
  const getSort = (field, condition) => {
    const newData = [...data];
    if (condition === "asc") {
      newData.sort((a, b) => (a[field] > b[field] && 1) || -1);
    } else if (condition === "desc") {
      newData.sort((a, b) => (a[field] > b[field] && -1) || 1);
    }
    setData(newData);
  };

  ////////// FILTER /////////////

  const getFilter = (operator, query, header) => {
    let lowQuery = query.toLowerCase();
    let newData = [...data];
    if (operator === "contains") {
      newData = initData.filter((ele) => {
        return ele[header].toLowerCase().includes(lowQuery);
      });
    } else if (operator === "equals") {
      newData = initData.filter((ele) => {
        return ele[header].toLowerCase() === lowQuery;
      });
    } else if (operator === "start-with") {
      newData = initData.filter((ele) => {
        return ele[header].toLowerCase().startsWith(lowQuery) === true;
      });
    } else if (operator === "end-with") {
      newData = initData.filter((ele) => {
        return ele[header].toLowerCase().endsWith(lowQuery) === true;
      });
    } else if (operator === "empty") {
      newData = initData.filter((ele) => {
        return (ele[header].toLowerCase().length = 0);
      });
    } else if (operator === "is-not-empty") {
      newData = initData.filter((ele) => {
        return ele[header].toLowerCase().length() > 0;
      });
    }
    setData(newData);
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className='App'>
      <Pagination page={page} pages={pages} changePage={setPage} />
      <Table data={data} getSort={getSort} getFilter={getFilter} />
    </div>
  );
}

export default App;
