import { PublishCommand } from "@aws-sdk/client-sns";

const sendEmail = async (client, {title, price}) => {
  var params = {
    Message: `Product ${title} with price ${price} was created`,
    TopicArn: process.env.SNS_ARN,
    MessageAttributes: {
      "price": {
        DataType: "Number",
        StringValue: price,
      },
    },
  };
  await client.send(new PublishCommand(params));
}

export default {
  sendEmail,
}