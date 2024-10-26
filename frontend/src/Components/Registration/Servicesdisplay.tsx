import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// const invoices = [
//   {
//     invoice: "INV001",
//     paymentStatus: "Paid",
//     totalAmount: "$250.00",
//     paymentMethod: "Credit Card",
//   },
//   {
//     invoice: "INV002",
//     paymentStatus: "Pending",
//     totalAmount: "$150.00",
//     paymentMethod: "PayPal",
//   },
//   {
//     invoice: "INV003",
//     paymentStatus: "Unpaid",
//     totalAmount: "$350.00",
//     paymentMethod: "Bank Transfer",
//   },
//   {
//     invoice: "INV004",
//     paymentStatus: "Paid",
//     totalAmount: "$450.00",
//     paymentMethod: "Credit Card",
//   },
//   {
//     invoice: "INV005",
//     paymentStatus: "Paid",
//     totalAmount: "$550.00",
//     paymentMethod: "PayPal",
//   },
//   {
//     invoice: "INV006",
//     paymentStatus: "Pending",
//     totalAmount: "$200.00",
//     paymentMethod: "Bank Transfer",
//   },
//   {
//     invoice: "INV007",
//     paymentStatus: "Unpaid",
//     totalAmount: "$300.00",
//     paymentMethod: "Credit Card",
//   },
// ];

export function Servicesdisplay({ invoices }) {
  console.log("Insidedata", invoices);
  return (
    <Table className="w-full min-w-[60rem] hover:bg-[#000000]">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader className="w-full hover:bg-[#000000] min-w-[100rem]">
        <TableRow className="w-full hover:bg-[#000000] ">
          <TableHead>name</TableHead>
          <TableHead>description</TableHead>
          <TableHead>price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-full min-w-[100rem]">
        {invoices?.map((invoice) => (
          <TableRow key={invoice.invoice} className="min-w-[100rem]">
            <TableCell className="font-medium">{invoice?.name}</TableCell>
            <TableCell>{invoice?.description}</TableCell>
            <TableCell>{invoice?.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
