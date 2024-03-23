import Table from "../../Common/Table";
import StyledButton from "../../Common/Button/StyledButton";
import defaultImage from "../../../assets/images/waste-default-image.webp";

export default function WasteList({ props, getWasteData, deleteWasteAction }) {
  console.log("props", props);
  const { id: wasteId, image, post, wasteCategory } = props;

  return (
    <tr className="hover:bg-gray-100">
      <Table.Row type="default">
        <img
          src={image?.url ? image.url : defaultImage}
          className="w-10 h-10"
        />
      </Table.Row>
      <Table.Row type="default">{post}</Table.Row>
      <Table.Row type="default">{wasteCategory}</Table.Row>

      <Table.Row type="actionButton">
        <StyledButton
          $variations="primaryBlue"
          $size="small"
          onClick={() => {
            getWasteData(wasteId);
          }}
        >
          Update
        </StyledButton>
      </Table.Row>
      <Table.Row type="actionButton">
        <StyledButton
          $variations="danger"
          $size="small"
          onClick={() => deleteWasteAction(wasteId)}
        >
          Delete
        </StyledButton>
      </Table.Row>
    </tr>
  );
}
