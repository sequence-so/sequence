import Select from "react-select";

const FilterRow = () => {
  return (
    <>
      <div className="row">
        <Select
          options={[
            { value: "phone_verified", label: "Phone Verified" },
            { value: "user_signup", label: "User Signup" },
            {
              value: "onboarding_clicked",
              label: "Onboarding Clicked",
            },
            {
              value: "credit_card_added",
              label: "Credit Card Added",
            },
            { value: "teammate_invited", label: "Teammate Invited" },
            {
              value: "integration_added",
              label: "Integration Added",
            },
          ]}
          styles={{
            container: (provided) => ({
              ...provided,
              width: 200,
              outline: "none",
              background: "white",
              "&:hover": {
                cursor: "pointer",
              },
              display: "inline-block",
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10,
            }),
          }}
        ></Select>
      </div>
      <style jsx>{`
        .row {
        }
      `}</style>
    </>
  );
};

export default FilterRow;
