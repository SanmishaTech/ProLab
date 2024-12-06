This is a documentation file for Register component of the Prolab system.

Inside the component, You will see this code first of all:

### Registertable component

<p>This is the main component we use to render the entire master </p>

<p>Lets dive Deep into he code. </p>

# Dependencies

<p>This Specific part above basically represents the improting the dependancies for the component, and variables and other states related to the component.
</p>

```

import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem"; // Corrected import path
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const [config, setConfig] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [machine, setMachine] = useState<any[]>([]);
  const [test, setTest] = useState<any[]>([]);


```

# Fetching Table Data

<p>This is the part where we fetch the data from the database and render it in the table.</p>

```js
useEffect(() => {
  const fetchcontainer = async () => {
    try {
      const response = await axios.get(`/api/container/allcontainer`);
      console.log("This is a mahcine", response.data.data.containerlinkmaster);
      setMachine(response.data.data.containerlinkmaster);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };
  const fetchTests = async () => {
    try {
      const response = await axios.get(
        `/api/testmaster/alltestmaster/${User?._id}`
      );
      console.log(response.data);
      setTest(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };
  fetchcontainer();
  fetchTests();
}, []);
```

# Add and Edit component Configuration

<!-- <h1> This is orcastration Part of config</h1>
<br>

<p>This component basically records the configurations of the component, Fancy way of saying what would be my variable names and how will they be labled and which parts need to me rendered, As only part which is specified will be rendered.</p>

<p> For below code we define the variables we will be using in the table.</p> -->

<span>Here We define the Type of schema we want to use to add variables and delete variables, Basically variables Which needs to be taken from user as a input</span>

<h5> For String component we use the following code</h5>

```js
const typeofschema = {
  name: {
    type: "String",
    label: "Name",
  },
};
```

<h5> For Select component we use the following code</h5>

```js
// Define the schema with various input types
const typeofschema = {
  name: {
    type: "Select",
    label: "Container",
    options: machine?.map((machine) => ({
      value: machine?._id,
      label: machine?.container,
    })),
  },
  test: {
    type: "Select",
    label: "Test Name",
    options: test?.map((test) => ({
      value: test?._id,
      label: test?.name,
    })),
  },
};
```

 <h5> For Number component we use the following code</h5>

```js
const typeofschema = {
  name: {
    type: "Number",
    label: "Name",
  },
};
```

# Configuration of the entire master

<h3> We define Other things Which Basically means everything from breadcrumbs, search and table data variables to use</h3>

```js
useEffect(() => {
  // Fetch data from the API
  axios
    .get(`/api/containerlinkmaster/allcontainerlinkmaster`)
    .then((response) => {
      setData(response.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      setError(err);
      setLoading(false);
    });

  // Define the dashboard configuration
  setConfig({
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Container Link Master" },
    ],
    searchPlaceholder: "Search Container Link Master...",
    userAvatar: userAvatar, // Use the imported avatar
    tableColumns: {
      title: "Container Link Master",
      description: "Manage Container Link Master and view their details.",
      headers: [
        { label: "Container", key: "name" },
        { label: "Test Name", key: "test" },
        { label: "Action", key: "action" },
      ],
      actions: [
        { label: "Edit", value: "edit" },
        { label: "Delete", value: "delete" },
      ],
      pagination: {
        from: 1,
        to: 10,
        total: 32,
      },
    },
  });
}, [User?._id]);
```

# Mapping the data to the variables we defined Before, This data we can Modify as we choose as long as we use the variables defined above.

```js
if (!data) return [];
const mappedTableData = data?.map((item) => {
  return {
    _id: item?._id,
    name: item?.name?.name || "Container not provided",
    test: item?.test?.name || "Test Name not provided",
    delete: `/containerlinkmaster/delete/${item?._id}`,
    action: "actions", // Placeholder for action buttons
    // Additional fields can be added here
  };
});
```

# Passing all the data to the Reuseable Component above

```js
return (
  <div className="p-4">
    <Dashboard
      breadcrumbs={config.breadcrumbs}
      searchPlaceholder={config.searchPlaceholder}
      userAvatar={config.userAvatar}
      tableColumns={config.tableColumns}
      tableData={mappedTableData}
      onAddProduct={handleAddProduct}
      onExport={handleExport}
      onFilterChange={handleFilterChange}
      onProductAction={handleProductAction}
      typeofschema={typeofschema}
      AddItem={() => (
        <AddItem typeofschema={typeofschema} onAdd={handleAddItem} />
      )}
    />
  </div>
);
```
