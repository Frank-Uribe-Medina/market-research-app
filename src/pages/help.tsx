import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material"
import { AuthAction, withUserTokenSSR } from "next-firebase-auth"
import { useSnapshot } from "valtio"

import Seo from "../components/Seo"
import state from "../contexts/ValtioStore"

const FAQS = [
  {
    question: "What is Market Recon?",
    answer:
      "Market Recon is a product-tracking and price-intelligence tool built for Amazon and Noon sellers. It helps you track product prices, stock status, historical changes, seller counts, and more — automatically.",
  },
  {
    question: "How do I create an account?",
    answer:
      "You can sign up using your Google account or email/password. Once registered, you can start tracking up to 10 products for free.",
  },
  {
    question: "How do I start tracking a product?",
    answer:
      "your Amazon or Noon product link into your dashboard → click “Track Product.” Market Recon will scrape the product and begin updating your data automatically.",
  },
  {
    question: "Is Market Recon free?",
    answer:
      "Yes. The Free Plan lets you track 10 products with basic data refreshes.",
  },
  {
    question: "Why upgrade?",
    answer:
      "Free users get only basic pricing data and limited tracking.Paid plans unlock high-value features designed for real sellers who rely on accurate data to make buying decisions.",
  },
  {
    question: "How often does Market Recon update data?",
    answer:
      "Free: Manually Run Pro: every 4–6 hours Premium: every 1–2 hours Enterprise: custom scraping frequency",
  },
  {
    question: "Why does my product show “Not Found” for SKU or sellers?",
    answer:
      "Some listings hide SKU or seller data — especially on Noon. Market Recon will try again on the next scrape cycle, or you can manually refresh.",
  },
  {
    question: "Still need help?",
    answer: "Email us at contact@brothersolutions.net",
  },
]

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (ctx) => {
  return {
    props: { userData: JSON.stringify(ctx.user) },
  }
})

function HelpPage() {
  const snap = useSnapshot(state)

  if (!snap.user) {
    return (
      <Container
        sx={{
          minHeight: "86vh",
          py: 5,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    )
  }
  if (!snap.user) {
    return (
      <Container
        sx={{
          minHeight: "86vh",
          py: 5,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    )
  }
  if (!snap.isUserLoaded) {
    return (
      <Container
        sx={{
          minHeight: "86vh",
          py: 5,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    )
  }
  return (
    <>
      <Seo title="Settings" />
      <Box sx={{ minHeight: "86vh", py: 5 }}>
        <Container sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <Typography fontWeight="bold" variant="h4">
            {" "}
            Need Help?
          </Typography>
          <Paper
            sx={{ display: "flex", flexDirection: "column", gap: 3, p: 4 }}
          >
            <Typography fontWeight="bold" variant="h4">
              Common Faqs
            </Typography>
            {FAQS.map((faq) => (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography component="span">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default HelpPage
