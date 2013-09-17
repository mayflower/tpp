<?php

namespace Mayflower\TPPBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Resource
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class Resource
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="Task", mappedBy="resource", cascade={"all"})
     */
    private $tasks;

    public function __construct() {
        $this->tasks = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Resource
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get tasks
     *
     * @return string
     */
    public function getTasks()
    {
        return $this->tasks;
    }

    /**
     * Add task
     *
     * @param Task $task
     *
     * @return Resource
     */
    public function addTask(Task $task)
    {
        $this->tasks->add($task);
        return $this;
    }

    /**
     * Remove task
     *
     * @param Task task
     *
     * @return Resource
     */
    public function removeTask(Task $task)
    {
        $this->tasks->removeElement($task);
        return $this;
    }

    /**
     * Return array for sending as JSON
     *
     * @return array This object suitable for passing to JsonResponse
     */
    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName()
        ];
    }
}
