import React, { useEffect, useState } from "react";
import "./MyOrderPage.css";
import Table from "../Common/Table";
import { orderAPI } from "../../services/orderServices";
import { toast } from "react-toastify";

const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const getProductDescription = (order) => {
    const titles = order.products.map(
      (p) => `${p.product.title}(${p.quantity})`,
    );
    return titles.join(", ");
  };

  const getOrders = () => {
    orderAPI()
      .then((response) => {
        const orderSummary = response.data.map((item) => ({
          description: getProductDescription(item),
          total: item.total,
          status: item.status,
        }));
        setOrders(orderSummary);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Unknown error at retrieving user orders");
      });
  };
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <section className="align_center myorder_page">
      {orders && (
        <Table headings={["Order", "Products", "Total", "Status"]}>
          <tbody>
            {orders.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.description}</td>
                <td>${item.total}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  );
};

export default MyOrderPage;
