import React from "react";
import { render } from "enzyme";
import ResidencyUser from "./04_ResidencyUser";
import defaultValues from "../initialState";

test("Basic component renders correctly", () => {
  const component = render(<ResidencyUser values={defaultValues} />);
  expect(component).toMatchSnapshot();
});
