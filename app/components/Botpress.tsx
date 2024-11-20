"use client";
import React from "react";
import Script from "next/script";

const Botpress = () => {
  return (
    <div>
      <Script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js" strategy="lazyOnload" />
      <Script src="https://files.bpcontent.cloud/2024/10/31/14/20241031140326-5Y66VD48.js" strategy="lazyOnload" />
    </div>
  );
};

export default Botpress;
