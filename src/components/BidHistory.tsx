import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface BidHistoryProps {
  bids: { userId: string; bid: number; timestamp: string }[];
  getUserName: (userId: string) => string;
}

function BidHistory({ bids, getUserName }: BidHistoryProps) {
  return (
    <Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Bid History</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {bids.map((bid, index) => (
            <Typography key={index} sx={{ mb: 1 }}>
              {getUserName(bid.userId)} - ${bid.bid} (Fecha:{" "}
              {new Date(bid.timestamp).toLocaleString()})
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default BidHistory;
