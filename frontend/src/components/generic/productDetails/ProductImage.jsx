import { Image } from "react-bootstrap";
import CONSTANTS from "../../../utils/constants";

const ProductImage = ({ img, cursorPointer = false, onImgClick = null }) => {
  return (
    <Image
      style={{ cursor: cursorPointer ? "pointer" : "default" }}
      id="modal-image"
      src={
        img instanceof File
          ? URL.createObjectURL(img)
          : `${CONSTANTS.API_BASE_URL}${img}`
      }
      alt="Product Image"
      fluid
      onClick={onImgClick}
    />
  );
};
export default ProductImage;
