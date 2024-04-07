import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import logo from "../../../Hr/asset/images/logo.png";
import header from "../../../Hr/asset/images/Header.png";
import footer from "../../../Hr/asset/images/Footer.png";
import DataNotFound from "../../../Hr/asset/images/no data 1.png";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import {
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import axios from "axios";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import CompanyLogoFile from "../../components/CompanyLogoFile";

const Policies = () => {
  const [menu, setMenu] = useState(false);

  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    const response = await axios.get(
      "https://api.orivehrms.com/policies/get/policies"
    );
    setPolicies(response.data);
  };

  console.log("poli", policies);

  const [search, setSearch] = useState("");
  const CustomTablePagination = styled(TablePagination)`
    & .${classes.toolbar} {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding: 0 0 0 10px;

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
      }
    }

    & .${classes.selectLabel} {
      margin: 0;
    }

    & .${classes.displayedRows} {
      margin: 0;

      @media (min-width: 768px) {
        margin-left: auto;
      }
    }

    & .${classes.spacer} {
      display: none;
    }

    & .${classes.actions} {
      display: flex;
      gap: 0rem;
    }
  `;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - policies.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  let doc;
  const convertToPdf = () => {
    try {
      doc = new jsPDF();
      const centerX = (doc.internal.pageSize.width - 80) / 2;
      doc.addImage(header, "PNG", 0, 0 + 0, doc.internal.pageSize.width, 10);
      doc.addImage(
        footer,
        "PNG",
        0,
        doc.internal.pageSize.height - 35,
        doc.internal.pageSize.width,
        35
      );
      const logoUrl = logo;
      doc.addImage(logoUrl, "PNG", centerX, 15, 80, 15);
      const tableMargin = 20;
      const tableStartY = 15 + tableMargin;
      doc.autoTable({
        head: [["SL", "COMPANY NAME", "TITLE", "DESCRIPTION"]],
        body: policies.map((row, index) => [
          index + 1,
          row.companyName,
          row.title,
          row.description,
        ]),
        styles: { fontSize: 5, fontStyle: "normal" },
        headStyles: {
          fillColor: [206, 206, 206],
          textColor: [20, 25, 40],
          fontSize: 5,
          fontStyle: "bold",
          width: 20,
        },
        startY: tableStartY,
      });
      doc.save("policies.pdf");
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };
  const createPdf = () => {
    try {
      doc = new jsPDF();
      const centerX = (doc.internal.pageSize.width - 80) / 2;
      doc.addImage(header, "PNG", 0, 0 + 0, doc.internal.pageSize.width, 10);
      doc.addImage(
        footer,
        "PNG",
        0,
        doc.internal.pageSize.height - 35,
        doc.internal.pageSize.width,
        35
      );
      const logoUrl = logo;
      doc.addImage(logoUrl, "PNG", centerX, 15, 80, 15);
      const tableMargin = 20;
      const tableStartY = 15 + tableMargin;
      doc.autoTable({
        head: [["SL", "COMPANY NAME", "TITLE", "DESCRIPTION"]],
        body: policies.map((row, index) => [
          index + 1,
          row.companyName,
          row.title,
          row.description,
        ]),
        styles: { fontSize: 5, fontStyle: "normal" },
        headStyles: {
          fillColor: [206, 206, 206],
          textColor: [20, 25, 40],
          fontSize: 5,
          fontStyle: "bold",
          width: 20,
        },
        startY: tableStartY,
      });
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

  const convertToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(policies);

    ws["!cols"] = [
      { width: 20 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "policies.xlsx");
  };

  const handlePrint = () => {
    createPdf();
    const pdfContent = doc.output("bloburl");

    if (pdfContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
            <style>
            @media print {
              body {
                margin: 0;
              }
              #pdfFrame {
                width: 100%;
                height: 100%;
              }
              @page {
                size: landscape;
              }
            }
          </style>
          </head>
          <body>
            <iframe id="pdfFrame" src="${pdfContent}" width="100%" height="100%"></iframe>
            <script>
              document.getElementById('pdfFrame').onload = function() {
                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 1000);
              };
            </script>
          </body>
        </html>
      `);
    }
  };

  const renderPoliciesData = () => {
    return (
      <tr>
        <td colSpan="12" className="text-center">
          <img style={{ margin: "50px 0 50px 0" }} src={DataNotFound}></img>
          <h1>No Data Found!</h1>
          <p>
            It Looks like there is no data to display in this table at the
            moment
          </p>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div id="header-container" className="header-container">
        <CompanyLogoFile />
        <Header menu={menu} setMenu={setMenu} />
      </div>
      <div className="dashboard-container">
        <SideBar menu={menu} setMenu={setMenu} />
        <div className="head-foot-part">
          <div className="page">
            <div
              className="d-flex"
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "70px",
              }}
            >
              <div
                className=" table-ka-top-btns"
              >
                        <div
            className="mx-3"
            style={{ width: "150px" }}
          >
            <div
              style={{
                fontSize: "1.4rem",
                width: "500px",
                display: "flex",
              }}
            >
              <div style={{ paddingRight: "10px" }}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAM7SURBVHgB3VVNaBNREJ55b3ezQYrRg9Sf2m3poTeriLQquBWrvQjtSTy1god6aoIXb9aTXqS99CCC9qoHE0GKYCEpolToIYKiojXJQaziYYNISpLdcXY3Nbv9iWlv+sJmed/OvG/mm5ldgP9lYbOGFw4OjTsEcSKIIUKq8hMSKStlNePbFMmIcf6+DTi6xjEvodw/k3+a/5t/Q5K4YcZ+qTuSHL3JppZDmHBsOyslJjkbg6+8ViVzOjdb2BZJvHvQcADTDkA7ARSqUg7defvktftsjJ8pJJKAdIi3lmJXT099fJbd7Cy5EXit2zSEpqQlR6siFYCgf/rd7IfV54s/PlnH2/Y/0FDsVQX0SgXHTrZ2FV98W1poimSi54yJikgrSK1SUHZFlvum3swtr7VbWM6vvPy+lDL3dYAmwGT7c2ZrJ8wvf55vSHLzqGlKAWlFkK4gzABVL97KZhp20HM+dOBAJ0aEc4qD6j/b1mnNfcm9CtqEajLZa6ZZf5OviasLmRuwhXW71xwVAPcIoYgR6Ehk6sGJoKGukqErDuwU5RnY4uKgZti/oEs71lIu7ww+U0IksuqmRlUB21oR9hcb+IdJVBaKCFu0cGc/HOgbdxDi3oaHxlcZM6WKlrgUkCWqOu4NW2xsQKLwXPNPDZTq8eCxEUJnimp7JG5o14icEV0pxRgarvt7JKCp4aYNJRZlI5dI1+tYRKO46xwRdgIi2EE6dqpoH+asLcaH0mZPLOjvnaFDg0yk7SmhQjWIxVxQRSd54tHin9dHZvhIkW+71N3oFtmq+7tKlBqQsKaeXHYAU9ZjPk6eqEE8GmEtHQe0RjVxU3W1D2oaremsrtE5qninUxDXJdsKWmcbJvG6yyHFrgSy8zqOI66EM6l1oqpVwiQcZhBbRxLxa4KaTgZvPf29juPzFA3CJNKvm1rb50a7DYFu/Qgcu1QM2obE+3q5e4LfvNe5PzlGn4QJ2sm3LAj+8wX1AMObGf6muDh7xDiPGMeY2XP3ff+mJO4qXumaFCjibkT+Gf5crM6g61DHkXHy5wY8pTKqqI5Gp3OFhiSrqzRmGBvhukQvlRWbQr48GxZO5Zv65v+76zfuAjbSpiR+NAAAAABJRU5ErkJggg=="
                  alt="Dashboard"
                />
              </div>
              <div style={{ padding: "2px" }}>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  <Link
                    to="/HRDashboard"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Dashboard{" "}
                  </Link>{" "}
                  / Employee /{" "}
                </span>
                <span style={{ color: "black" }}> Policies</span>
              </div>
            </div>
          </div>
                {
                  <div
                    className="search-print"
                    style={{

                    }}
                  >
                    <input
                      type="text"
                      className="search-beside-btn"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        width: "20rem",
                        borderRadius: "5px",
                        height: "40px",
                        padding: "10px",
                        border: "1px solid rgba(247, 108, 36, 1)",
                        marginRight: "30px",
                      }}
                    />
                    <div
                      className="d-flex mt-4 four-btn"
                      style={{ gap: "10px" }}
                      y
                    >
                      <button
                        className=""
                        style={{
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          width: "100px",
                          justifyContent: "center",
                        }}
                        onClick={handlePrint}
                      >
                        PRINT
                      </button>
                      <button
                        onClick={convertToPdf}
                        className=""
                        style={{
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          width: "100px",
                          justifyContent: "center",
                        }}
                      >
                        PDF
                      </button>
                      <button
                        onClick={convertToExcel}
                        className=""
                        style={{
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          width: "100px",
                          justifyContent: "center",
                        }}
                      >
                        EXCEL
                      </button>
                      <CSVLink
                        data={policies}
                        filename="policies.csv"
                        style={{ textDecoration: "none" }}
                      >
                        <button
                          className=""
                          style={{
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            width: "100px",
                            justifyContent: "center",
                          }}
                        >
                          CSV
                        </button>
                      </CSVLink>
                    </div>
                  </div>
                }
              </div>

              <div className="table-start-container">
                <table
                  id="table"
                  className="table table-bordered table-hover shadow"
                >
                  <thead>
                    <tr className="text-center">
                      <th>SL.</th>
                      <th>Company name</th>
                      <th>Title</th>
                      <th>Description</th>
                      {/* <th>Status</th> */}
                      <th colSpan="1">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="text-center">
                    {policies.length === 0
                      ? renderPoliciesData()
                      : (rowsPerPage > 0
                          ? policies.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : policies
                        )
                          .filter((elem) => {
                            if (search.length === 0) return elem;
                            else
                              return (
                                elem.companyName
                                  .toLowerCase()
                                  .includes(search.toLocaleLowerCase()) ||
                                elem.title
                                  .toLowerCase()
                                  .includes(search.toLocaleLowerCase()) ||
                                elem.description
                                  .toLowerCase()
                                  .includes(search.toLocaleLowerCase())
                              );
                          })
                          .map((policies, index) => (
                            <tr key={policies.expenceId}>
                              <th scope="row" key={index}>
                                {index + 1}
                              </th>
                              <td>{policies.companyName}</td>
                              <td>{policies.title}</td>
                              <td>{policies.description}</td>
                              {/* <td>{policies.status?policies.status:"-nil-"}</td> */}

                              <td className="mx-2">
                                <Link
                                  to={`/organisation/policies-profile/${policies.policiesId}`}
                                >
                                  <FaEye className="action-eye" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <CustomTablePagination
                        className="pagingg"
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: "All", value: -1 },
                        ]}
                        colSpan={12}
                        count={policies.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        slotProps={{
                          select: {
                            "aria-label": "rows per page",
                          },
                          actions: {
                            // showFirstButton: true,
                            // showLastButton: true,
                          },
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Policies;
