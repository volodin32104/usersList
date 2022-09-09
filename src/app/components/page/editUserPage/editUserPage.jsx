import React, { useEffect, useState } from "react";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { getQualities, getQualitiesLoadingStatus } from "../../../store/qualities";
import { getProfessions, getProfessionsLoadingStatus } from "../../../store/professions";
import { getCurrentUserData, updateUserData } from "../../../store/users";
import { useDispatch, useSelector } from "react-redux";

const EditUserPage = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(getCurrentUserData());
     const professionsLoading = useSelector(getProfessionsLoadingStatus());
    const professions = useSelector(getProfessions());
    const qualities = useSelector(getQualities());
    const qualitiesLoading = useSelector(getQualitiesLoadingStatus());
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    const [errors, setErrors] = useState({});
    const professionsList = professions.map(p => ({ label: p.name, value: p._id }));
      const qualitiesList = qualities.map(q => ({ label: q.name, value: q._id }));

    // const getProfessionById = () => {
    //     // for (const prof of professions) {
    //     //     if (prof.value === id) {
    //     //         return { _id: prof.value, name: prof.label };
    //     //     }
    //     // }
    //     const profession = getProfession(currentUser.profession);
    //     return profession.name;
    // };
    // console.log(getProfessionById());
    // const getQualities = () => {
    //     // const qualitiesArray = [];
    //     // for (const elem of elements) {
    //     //     for (const quality in qualities) {
    //     //         if (elem.value === qualities[quality].value) {
    //     //             qualitiesArray.push({
    //     //                 _id: qualities[quality].value,
    //     //                 name: qualities[quality].label,
    //     //                 color: qualities[quality].color
    //     //             });
    //     //         }
    //     //     }
    //     // }
    //     // return qualitiesArray;
    //     return quality = getQuality(currentUser.qualities.toString());
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValidate = validate();
        if (!isValidate) return;
        dispatch(updateUserData({ ...data, qualities: data.qualities.map((qual) => qual.value) }));
    };
    function getQualitiesListByIds(qualitiesIds) {
        const qualitiesArray = [];
        for (const qualId of qualitiesIds) {
            for (const quality of qualities) {
                if (quality._id === qualId) {
                    qualitiesArray.push(quality);
                    break;
                }
            }
        }
         return qualitiesArray;
    }

    const transformData = (data) => {
      return getQualitiesListByIds(data).map((qual) => ({ label: qual.name, value: qual._id }));
    };
    useEffect(() => {
        if (!professionsLoading && !qualitiesLoading && currentUser && !data) {
            setData({
                ...currentUser,
                qualities: transformData(currentUser.qualities)

            });
        }
    }, [professionsLoading, qualitiesLoading, currentUser, data]);
    useEffect(() => {
 if (data && isLoading) {
        setIsLoading(false);
    }
}, [data]);

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;
    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isLoading && Object.keys(professions).length > 0 ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                options={professionsList}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={data.qualities}
                                options={qualitiesList}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
