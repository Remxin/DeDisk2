import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";
import { Hr } from "@react-email/hr";
import { Button } from "@react-email/button";

// constatns
import { appConstants } from "@/src/constants/appConstants";
import { colorConstants } from "@/src/constants/colorsConstants";


type componentProps = {
    sharerName: string
    resourceName: string
    name: string
    token: string
}

export function ShareEmail({ sharerName, resourceName, token }: componentProps) {
    return (
        <Html>
            <Section style={main}>
                <Container style={headerContainer}>
                    <Text style={heading}>{sharerName} shared you {resourceName}</Text>
                    <Hr />
                </Container>
                <Container style={container}>
                    <Text style={paragraph}>Click the button to see the shared content</Text>
                    {/* @ts-ignore */}
                    <Button style={button} target="_blank" href={`${appConstants.clientUrl}/shared?token=${token}&path=/`}><Text style={buttonText}>See the content</Text></Button>
                    <Text style={postScriptum}>*This button link is secret! Do not share it with anyone</Text>
                </Container>
            </Section>
        </Html>
    );
}

// Styles for the email template
const headerContainer = {

    display: "flex",
    justifyContent: "center",
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "620px",
}
const button = {
    position: "relative",
    padding: "0",
    backgroundColor: colorConstants.blue,
    fontWeight: "bold",
    width: "160px",
    height: "40px",
    borderRadius: "8px",
}

const buttonText = {
    width: "160px",
    height: "40px",
    color: "#fff",
    fontSize: "18px",
    lineHeight: "18px",
    marginTop: "11px",
    textAlign: "center",
    vericalAlign: "center",
    margin: 0
}

const main = {
    backgroundColor: "#ffffff",
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "580px",
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

const postScriptum = {
    fontSize: "11px",
    lineHeight: "0.8",
    color: "#676767",
}