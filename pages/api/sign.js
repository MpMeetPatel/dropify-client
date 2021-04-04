const cloudinary = require("cloudinary").v2;

export default async (_, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDNARY_SECERET_KEY
  );

  res.statusCode = 200;
  res.json({ signature, timestamp });
};
