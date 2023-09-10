import "./App.css";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function CurrencyFormat({ amount }) {
  // Convert the amount to a number if it's not already
  const numberAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  // Use the toLocaleString() method to format the number as currency
  const formattedAmount = numberAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return <span>{formattedAmount}</span>;
}

function App() {
  const maxValue = 10000000;
  const interestMax = 30;
  const maxDuration = 30;

  const [pAmount, setpAmount] = useState(1000000);
  const [interest, setInterest] = useState(6.5);
  const [duration, setDuration] = useState(5);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tableData, setTableData] = useState({});

  useEffect(() => {
    const loanAmount = parseFloat(pAmount);
    const rateOfInterest = parseFloat(interest) / 100 / 12;
    const numberOfPayments = parseFloat(duration) * 12;
    const emiAmount =
      loanAmount *
      rateOfInterest *
      (Math.pow(1 + rateOfInterest, numberOfPayments) /
        (Math.pow(1 + rateOfInterest, numberOfPayments) - 1));

    setEmi(emiAmount);

    // Calculate total payable based on emiAmount and loanTerm
    const totalPayableAmount = emiAmount * numberOfPayments;
    setTotalInterest(totalPayableAmount - loanAmount);
    setTotalAmount(totalPayableAmount);

    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let balance = loanAmount;
    const emiDataByYear = {};
    for (let i = 1; i <= numberOfPayments; i++) {
      const monthlyInterest = balance * rateOfInterest;
      const principalPayment = emiAmount - monthlyInterest;

      if (!emiDataByYear[currentYear]) {
        emiDataByYear[currentYear] = [];
      }

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      emiDataByYear[currentYear].push({
        Month: monthNames[currentMonth],
        Year: currentYear,
        OpeningBalance: Math.round(balance),
        EMIAmount: Math.round(emiAmount),
        PrincipalAmount: Math.round(principalPayment),
        InterestAmount: Math.round(monthlyInterest),
        Balance: Math.round(balance - principalPayment),
      });

      currentMonth++;
      if (currentMonth === 12) {
        currentMonth = 0; // January is 0 in JavaScript Date object
        currentYear++;
      }

      balance -= principalPayment;
    }
    setTableData(emiDataByYear);
  }, [pAmount, interest, duration]);
  return (
    <div className="App">
      <Stack spacing={2} marginTop={5}>
        <Stack direction="row" spacing={4} justifyContent="center">
          <Card sx={{ width: 600 }}>
            <CardContent>
              <Typography id="loan-amount" gutterBottom>
                Loan Amount
              </Typography>
              <Slider
                aria-labelledby="loan-amount"
                value={pAmount}
                valueLabelDisplay="auto"
                step={1000000}
                min={100000}
                max={maxValue}
                onChange={(e) => {
                  setpAmount(e.target.value);
                }}
              />
              <Typography id="interest-rate" gutterBottom>
                Interest %
              </Typography>
              <Slider
                aria-labelledby="interest-rate"
                value={interest}
                valueLabelDisplay="auto"
                step={0.1}
                min={1}
                max={interestMax}
                onChange={(e) => {
                  setInterest(e.target.value);
                }}
              />
              <Typography id="duration" gutterBottom>
                Duration
              </Typography>
              <Slider
                aria-labelledby="duration"
                value={duration}
                valueLabelDisplay="auto"
                step={1}
                min={2}
                max={maxDuration}
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
              />
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275 }}>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>EMI Amonut</TableCell>
                    <TableCell>{Math.round(emi)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interest Amonut</TableCell>
                    <TableCell>{Math.round(totalInterest)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>{Math.round(totalAmount)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            {Object.keys(tableData).map((year) => (
              <Accordion key={year}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6">{year}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell align="right">Opening Balance</TableCell>
                          <TableCell align="right">EMI Amount</TableCell>
                          <TableCell align="right">Principal Amount</TableCell>
                          <TableCell align="right">Interest Amount</TableCell>
                          <TableCell align="right">Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData[year].map((row) => (
                          <TableRow
                            key={row.Month}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.Month}
                            </TableCell>
                            <TableCell align="right">
                              <CurrencyFormat amount={row.OpeningBalance} />
                            </TableCell>
                            <TableCell align="right">
                              <CurrencyFormat amount={row.EMIAmount} />
                            </TableCell>
                            <TableCell align="right">
                              <CurrencyFormat amount={row.PrincipalAmount} />
                            </TableCell>
                            <TableCell align="right">
                              <CurrencyFormat amount={row.InterestAmount} />
                            </TableCell>
                            <TableCell align="right">
                              <CurrencyFormat amount={row.Balance} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
}

export default App;
