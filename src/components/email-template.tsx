import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NewMessageEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const NewMessageEmail = ({
  name,
  email,
  message,
  phone,
}: NewMessageEmailProps) => {
  const previewText = `New message from ${name}`;

  return (
    <Html>
      <Head />

      <Body style={main}>
        <Preview>{previewText}</Preview>
        <Container style={container}>
          <Section style={{ paddingBottom: "20px" }}>
            <Row>
              <Text style={heading}>Here&apos;s what {name} wrote</Text>
              <Text style={review}>{message}</Text>
              <Text style={paragraph}>
                This email was sent to you by your portfolio.
              </Text>

              <Button style={button} href="https://zuhayrr.com">
                Open Portfolio
              </Button>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section>
            <Row>
              <Text style={{ ...paragraph, fontWeight: "700" }}>
                Contact Information
              </Text>
              <Text>Email: {email}</Text>
              <Text>Contact No.: {phone}</Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewMessageEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const review = {
  ...paragraph,
  padding: "24px",
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
};

const button = {
  backgroundColor: "#ff5a5f",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "18px",
  padding: "19px 30px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};
