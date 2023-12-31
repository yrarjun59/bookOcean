import React, { useEffect } from "react";
import { listMyOrders } from "../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import formateDate from "../assets/js/formateDate";
import Paginat from "../components/Paginat";



function MyOrderScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderListMy = useSelector((state) => state.orderListMy);
  const {
    loading: loadingOrders,
    error: errorOrders,
    orders,
    page,
    pages,
  } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(listMyOrders());
    }
  }, [userInfo,  dispatch, navigate]);

  return (
    <div className="mx-100">
        <Row>
          <Col md={9}>
            {loadingOrders ? (
              <Loader />
              ) : errorOrders ? (
                <Message variant="danger">{errorOrders}</Message>
                ) : 
                orders.length > 0 ? (
                  <div>
                    <h2 style={{textAlign:'center'}}>My Orders</h2>
                    <Table striped responsive className="table-sm">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Paid</th>
                          <th>Delivered</th>
                          <th>Details</th>
                        </tr>
                      </thead>
    
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{formateDate(order.createdAt)}</td>
                            <td>Rs {order.totalPrice}</td>
                        
                            <td>
                              {order.isPaid ? (
                                formateDate(order.paidAt)
                              ) : (
                                <i
                                  className="fas fa-times"
                                  style={{ color: "red" }}
                                ></i>
                              )}
                            </td>
                        
                            <td>
                              {order.Delivered ? (
                                formateDate(order.deliveredAt)
                              ) : (
                                <i
                                  className="fas fa-times"
                                  style={{ color: "red" }}
                                ></i>
                              )}
                            </td>
                        
                            <td>
                              <LinkContainer to={`/order/${order._id}`}>
                                <Button className="btn-sm">Details</Button>
                              </LinkContainer>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Paginat pages = {pages} page = {page}/>
                  </div>
                ):(
                  <h2 style={{textAlign:'center'}}>You have no orders</h2>
                )}
          </Col>
        </Row>
    </div>
  );
}

export default MyOrderScreen;
