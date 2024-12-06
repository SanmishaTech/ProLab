This is a documentation file for Register component of the Prolab system.

Inside the component, You will see this code first of all:

### Registertable component

<p>This is the main component we use to render the entire master </p>

<p>Lets dive Deep into he code. </p>

# dependencies

<p>This Specific part above basically represents the improting the dependancies for the component, and variables and other states related to the component.
</p>

```
import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem";
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
export default function Dashboardholiday() {

const user = localStorage.getItem("user");
const User = JSON.parse(user);
const [config, setConfig] = useState(null);
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

```

<p>This is the part where we define the variables we will be using to render the components inside the popup for add and remove items. </p>
<p>

```js
const typeofschema = {
  specimen: "String",
};
```

# Render Config

<h1> This is orcastration Part of config</h1>
<br>

<p>This component basically records the configurations of the component, Fancy way of saying what would be my variable names and how will they be labled and which parts need to me rendered, As only part which is specified will be rendered.</p>
