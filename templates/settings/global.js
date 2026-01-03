export const GLOBAL_SETTINGS_TEMPLATE = [
  {
    key: "contact",
    label: "Contact Information",
    fields: [
      { name: "phone", label: "Phone Number", type: "text" },
      { name: "email", label: "Email Address", type: "text" },
      { name: "address", label: "Address", type: "rich" },
    ],
  },

  {
    key: "socials",
    label: "Social Media",
    fields: [
      { name: "facebook", label: "Facebook URL", type: "text" },
      { name: "instagram", label: "Instagram URL", type: "text" },
      { name: "x", label: "X / Twitter URL", type: "text" },
      { name: "youtube", label: "YouTube URL", type: "text" },
      { name: "linkedin", label: "LinkedIn URL", type: "text" },
    ],
  },

  {
    key: "usps",
    label: "USPs",
    fields: [
      {
        name: "items",
        label: "USP Items",
        type: "repeater",
        of: [
          { name: "text", label: "USP Text", type: "textarea" },
          { name: "image", label: "USP Image", type: "image" },
        ],
      },
    ],
  },
];