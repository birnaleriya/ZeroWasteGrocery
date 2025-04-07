import bgImage from "../assets/smart_grocery.png";

const SmartGrocery = () => {
    return (
        <div
            className="smart-grocery"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <h1 className="smart-grocery-title">Smart Grocery</h1>
            <div className="smart-grocery-content">
                <p className="smart-grocery-description">Upload the image of your grocery list</p>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Pick a file</legend>
                    <input type="file" className="file-input-xl-info" />
                    <label className="fieldset-label">Max size 20MB</label>
                </fieldset>
            </div>
        </div>
    );
};

export default SmartGrocery;
